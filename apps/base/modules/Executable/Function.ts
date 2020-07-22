import { Executable } from "./Executable";
import { ShellCommunicator } from "../Communicator/ShellCommunicator";
import * as uuid from "uuid";
import * as Lodash from "lodash";
import { EnvironmentClient } from "../Client/EnvironmentClient";
import { ClientCommunicator } from "../Communicator/ClientCommunicator";
import { FileSystemCommunicator } from "../Communicator/FileSystemCommunicator";
import { Client } from "../Client/Client";
import { FileSystem } from "../FileSystem/FileSystem";

export class Function implements Executable {

  constructor(
    private username: string,
    private name: string,
    private visibility: string,
    private command: string,
    private args: string,
    private file: string,
    private shell: ShellCommunicator,
    private environmentClient: EnvironmentClient,
    private filesystem: FileSystem
  ) { 

  }

  public getUsername() {
    return this.username
  }

  public getName(): string {
    return this.name
  }

  public getVisibility(): string {
    return this.visibility
  }

  public run(data: any): Promise<any> {
    // TRANSORMATION
    if (data.transformData !== undefined) {
      // Get data from uid
      // Run function with data as input
      // Write output to new tag
      const transformData = data.transformData
      const path = ["data", transformData.username, transformData.cluster, transformData.environment, transformData.name, transformData.prevTag, "dataset"].join("/")          
      const newPath = ["data", transformData.username, transformData.cluster, transformData.environment, transformData.name, transformData.newTag].join("/")
      const dataset = this.filesystem.get(path)
      return this.shell.exec(this.file, this.command, this.args, dataset)
      .then((transformedData) => {
        return this.filesystem.put(newPath, "dataset", JSON.stringify(transformedData))
      })
    }

    // DATA LOAD
    if (data.loadData !== undefined) {
      const loadData = data.loadData 
      return Promise.all([
        this.shell.exec(this.file, this.command, this.args, {}),
        this.environmentClient.getEndpoints(loadData.username, loadData.environment, loadData.cluster)
      ]).then((results: any[]) => {
        const functionResult = results[0]
        const endpoints = results[1]
        const subset = endpoints["subsets"][0]
        const port = subset["ports"][0]["port"]
        const addresses = subset["addresses"]
        const tag = uuid.v4()
  
        return Promise.all(Lodash.map(addresses, (addr, index) => {
          const val = (functionResult.length / addresses.length) 
          const start = parseInt(index) * val
          const end = (parseInt(index)+1) * val
          const dataset = functionResult.slice(start, end)
          const host = addr["ip"]
          const client = new ClientCommunicator(host, port)
          const fsCommunicator = new FileSystemCommunicator(client)
          const path = ["data", loadData.username, loadData.cluster, loadData.environment, loadData.name, tag].join("/")
          return fsCommunicator.putFile(path, {
            name: "dataset",
            file: JSON.stringify(dataset)
          })
        })).then((result) => {
          return { tag: tag }
        })
      })
    }

    // NORMAL EXECUTION
    return this.shell.exec(this.file, this.command, this.args, data)
  }
}
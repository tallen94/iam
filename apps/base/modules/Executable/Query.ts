import { Executable } from "./Executable";
import { DatabaseCommunicator } from "../Communicator/DatabaseCommunicator";
import { EnvironmentClient } from "../Client/EnvironmentClient";
import * as Lodash from "lodash";
import { ClientCommunicator } from "../Communicator/ClientCommunicator";
import { FileSystemCommunicator } from "../Communicator/FileSystemCommunicator";
import * as uuid from "uuid";

export class Query implements Executable {

  constructor(
    private username: string,
    private name: string,
    private visibility: string,
    private file: string,
    private database: DatabaseCommunicator,
    private environmentClient: EnvironmentClient
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
    if (data.loadData == undefined) {
      return this.database.execute(this.file, data)
    }
    const loadData = data.loadData
    return Promise.all([
      this.database.execute(this.file, loadData.executableData),
      this.environmentClient.getEndpoints(loadData.username, loadData.environment, loadData.cluster)
    ]).then((results: any[]) => {
      const queryResult = results[0]
      const endpoints = results[1]
      const subset = endpoints["subsets"][0]
      const port = subset["ports"][0]["port"]
      const addresses = subset["addresses"]
      const tag = uuid.v4()

      // [1, 2, 3, 4, 5, 6, 7, 8]
      return Promise.all(Lodash.map(addresses, (addr, index) => {
        const val = (queryResult.length / addresses.length) 
        const start = parseInt(index) * val
        const end = (parseInt(index)+1) * val
        const dataset = queryResult.slice(start, end)
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
    });
  }
}
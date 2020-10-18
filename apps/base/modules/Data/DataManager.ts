import { EnvironmentClient } from "../Client/EnvironmentClient";
import * as Lodash from "lodash";
import { DatabaseCommunicator } from "../Communicator/DatabaseCommunicator";
import { Queries } from "../Constants/Queries";
import { Client } from "../Client/Client";
import { ClientCommunicator } from "../Communicator/ClientCommunicator";
import { FileSystemCommunicator } from "../Communicator/FileSystemCommunicator";
import * as uuid from "uuid";

export class DataManager {

  constructor(private databaseCommunicator: DatabaseCommunicator, private environmentClient: EnvironmentClient, private environmentRouterClient: Client) {

  }

  public addDataset(data: any) {
    const executableData = JSON.stringify(data.executable)
    return this.getDataset(data.username, data.cluster, data.environment, data.name)
    .then((result) => {
      if (result == undefined) {
        return this.databaseCommunicator.execute(Queries.ADD_DATASET, {
          username: data.username,
          name: data.name,
          cluster: data.cluster,
          environment: data.environment,
          description: data.description,
          executable: executableData,
          tag: JSON.stringify([])
        })
      }
      return this.databaseCommunicator.execute(Queries.UPDATE_DATASET, {
        username: data.username,
        name: data.name,
        cluster: data.cluster,
        environment: data.environment,
        description: data.description,
        executable: executableData,
        tag: JSON.stringify(data.tag)
      })
    })
  }

  public getDataset(username: string, cluster: string, environment: string, name: string) {
    return this.databaseCommunicator.execute(Queries.GET_DATASET, {username: username, cluster: cluster, environment: environment, name: name})
    .then((result) => {
      if (result.length > 0) {
        const item = result[0];
        item.executable = JSON.parse(item.executable)
        item.tag = JSON.parse(item.tag)
        return item
      }
      return undefined
    })
  }

  public getDatasetForUser(username: string) {
    return this.databaseCommunicator.execute(Queries.GET_DATASET_FOR_USER, {username: username})
    .then((results: any[]) => {
      return Promise.all(Lodash.map(results, (item) => {
        item.executable = JSON.parse(item.executable)
        item.tag = JSON.parse(item.tag)
        return item
      }))
    })
  }

  public loadDataset(username: string, cluster: string, environment: string, name: string, executableData: any, authData: any) {
    return this.getDataset(username, cluster, environment, name)
    .then((dataset: any) => {
      const loadData = {
        username: dataset.username,
        cluster: dataset.cluster, 
        environment: dataset.environment,
        name: dataset.name,
        executableData: executableData
      }
      return this.environmentRouterClient.runExecutable(dataset.executable.username, dataset.executable.cluster, dataset.executable.environment, dataset.executable.exe, dataset.executable.name, {loadData: loadData}, authData)
      .then((result: any) => {
        dataset.tag.push(result.result.tag)
        return this.addDataset(dataset)
      }).then((result) => {
        return dataset
      })
    })
  }

  public transformData(username: string, cluster: string, environment: string, name: string, functionData: any, authData: any) {
    return this.getDataset(username, cluster, environment, name)
    .then((dataset: any) => {
      const transformData = functionData
      transformData.prevTag = dataset.tag[dataset.tag.length - 1]
      // Get endpoints 
      // Generate new data tag
      // Run function for each endpoint
      return this.environmentClient.getEndpoints(transformData.username, transformData.environment, transformData.cluster)
      .then((endpoints: any) => {
        const subset = endpoints["subsets"][0]
        const port = subset["ports"][0]["port"]
        const addresses = subset["addresses"]
        const tag = uuid.v4()
        transformData.newTag = tag

        return Promise.all(Lodash.map(addresses, (addr, index) => {
          const host = addr["ip"]
          const client = new Client(new ClientCommunicator(host, port)) 
          return client.runExecutable(transformData.username, transformData.cluster, transformData.environment, transformData.exe, transformData.name, { transformData: transformData }, authData)
        })).then((results) => {
          return {tag: tag}
        })
      })
    })
  }

  public readDataset(username: string, cluster: string, environment: string, name: string, tag: string, limit: number) {
    return this.getDataset(username, cluster, environment, name)
    .then((dataset: any) => {
      return this.environmentClient.getEndpoints(username, environment, cluster)
      .then((endpoints) => {
        const subset = endpoints["subsets"][0]
        const port = subset["ports"][0]["port"]
        const addresses = subset["addresses"]

        return Promise.all(Lodash.map(addresses, (addr) => {
          const host = addr["ip"]
          const client = new ClientCommunicator(host, port)
          const fsCommunicator = new FileSystemCommunicator(client)
          const folder = ["data", username, cluster, environment, dataset.name, tag].join("/")
          return fsCommunicator.getFile(folder, "dataset")
        })).then((results: any[]) => {
          let merged = []
          let i = 0;
          while (merged.length < limit && i < results.length) {
            if (results[i] != "invalid path") {
              merged = merged.concat(results[i])
            }
            i++;
          }
          return merged.slice(0, limit)
        })
      })
    })
  }

  public deleteDatasetTag(username: string, cluster: string, environment: string, name: string, tag: string) {
    return this.getDataset(username, cluster, environment, name)
    .then((dataset: any) => {
      return this.environmentClient.getEndpoints(username, environment, cluster)
      .then((endpoints) => {
        const subset = endpoints["subsets"][0]
        const port = subset["ports"][0]["port"]
        const addresses = subset["addresses"]

        return Promise.all(Lodash.map(addresses, (addr) => {
          const host = addr["ip"]
          const client = new ClientCommunicator(host, port)
          const fsCommunicator = new FileSystemCommunicator(client)
          const tagPath = ["data", username, cluster, environment, dataset.name, tag].join("/")
          const folderPath = ["data", username, cluster, environment, dataset.name].join("/")
          return fsCommunicator.deleteFile(tagPath, "dataset")
          .then((result) => {
            return fsCommunicator.deleteFile(folderPath, tag)
          })
        }))
      }).then((result: any) => {
        dataset.tag = Lodash.filter(dataset.tag, (item) => item !== tag)
        return this.addDataset(dataset)
      }).then((result) => {
        return dataset
      })
    })
  }
}
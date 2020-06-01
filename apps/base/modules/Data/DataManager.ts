import { EnvironmentClient } from "../Client/EnvironmentClient";
import * as Lodash from "lodash";
import { DatabaseCommunicator } from "../Communicator/DatabaseCommunicator";
import { Queries } from "../Constants/Queries";
import { Client } from "../Client/Client";

export class DataManager {

  constructor(private databaseCommunicator: DatabaseCommunicator, private environmentClient: EnvironmentClient, private environmentRouterClient: Client) {

  }

  public addDataset(data: any) {
    const queryData = JSON.stringify(data.query)
    return this.getDataset(data.username, data.cluster, data.environment, data.name)
    .then((result) => {
      if (result == undefined) {
        return this.databaseCommunicator.execute(Queries.ADD_DATASET, {
          username: data.username,
          name: data.name,
          cluster: data.cluster,
          environment: data.environment,
          description: data.description,
          query: queryData,
          tag: ""
        })
      }
      return this.databaseCommunicator.execute(Queries.UPDATE_DATASET, {
        username: data.username,
        name: data.name,
        cluster: data.cluster,
        environment: data.environment,
        description: data.description,
        query: queryData,
        tag: data.tag
      })
    })
  }

  public getDataset(username: string, cluster: string, environment: string, name: string) {
    return this.databaseCommunicator.execute(Queries.GET_DATASET, {username: username, cluster: cluster, environment: environment, name: name})
    .then((result) => {
      if (result.length > 0) {
        const item = result[0];
        item.query = JSON.parse(item.query)
        return item
      }
      return undefined
    })
  }

  public getDatasetForUser(username: string) {
    return this.databaseCommunicator.execute(Queries.GET_DATASET_FOR_USER, {username: username})
    .then((results: any[]) => {
      return Promise.all(Lodash.map(results, (item) => {
        item.query = JSON.parse(item.query)
        return item
      }))
    })
  }

  public loadDataset(username: string, cluster: string, environment: string, name: string, queryData: any) {
    return this.getDataset(username, cluster, environment, name)
    .then((dataset: any) => {
      const loadData = {
        username: dataset.username,
        cluster: dataset.cluster, 
        environment: dataset.environment,
        name: dataset.name,
        queryData: queryData
      }
      return this.environmentRouterClient.runExecutable(dataset.query.username, dataset.query.cluster, dataset.query.environment, "query", dataset.query.name, {loadData: loadData}, "")
      .then((result: any) => {
        dataset.tag = result.result.tag
        return this.addDataset(dataset)
      }).then((result) => {
        return dataset
      })
    })
  }

  public transformData(username: string, cluster: string, environment: string, name: string, functionData: any) {
    return Promise.resolve()
  }
}
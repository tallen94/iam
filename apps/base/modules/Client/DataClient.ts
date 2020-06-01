import { ClientCommunicator } from "../Communicator/ClientCommunicator";
import { ApiPaths } from "../Api/ApiPaths";

export class DataClient {

  constructor(private clientCommunicator: ClientCommunicator) {

  }

  addDataset(data: any) {
    return this.clientCommunicator.post(ApiPaths.ADD_DATASET, data)
  }

  getDataset(username: string, cluster: string, environment: string, name: string) {
    return this.clientCommunicator.get(ApiPaths.GET_DATASET, {username: username, cluster: cluster, environment: environment, name: name})
  }

  getDatasetForUser(username: string) {
    return this.clientCommunicator.get(ApiPaths.GET_DATASET_FOR_USER, {username: username})
  }

  loadDataset(username: string, cluster: string, environment: string, name: string, queryData: any) {
    return this.clientCommunicator.post(ApiPaths.LOAD_DATASET, {username: username, cluster: cluster, environment: environment, name: name, queryData: queryData})
  }

  transformDataset(username: string, cluster: string, environment: string, name: string, functionData: any) {
    return this.clientCommunicator.post(ApiPaths.TRANSFORM_DATASET, {username: username, cluster: cluster, environment: environment, name: name, functionData: functionData})
  }

  readDataset(username: string, cluster: string, environment: string, name: string, tag: string, limit: number) {
    return this.clientCommunicator.get(ApiPaths.READ_DATASET, {username: username, cluster: cluster, environment: environment, name: name, tag: tag, limit: limit})
  }

  deleteDatasetTag(username: string, cluster: string, environment: string, name: string, tag: string) {
    return this.clientCommunicator.delete(ApiPaths.DELETE_DATASET_TAG, {username: username, cluster: cluster, environment: environment, name: name, tag: tag})
  }
}
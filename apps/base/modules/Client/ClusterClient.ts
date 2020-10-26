import { ClientCommunicator } from "../Communicator/ClientCommunicator";
import { ApiPaths } from "../Api/ApiPaths";
import { AuthData } from "../Auth/AuthData";

export class ClusterClient {

  constructor(private clientCommunicator: ClientCommunicator) {

  }

  public addCluster(data: any, authData: AuthData) {
    return this.clientCommunicator.post(ApiPaths.ADD_CLUSTER, data)
  }

  public getCluster(username: string, name: string, authData: AuthData) {
    return this.clientCommunicator.get(ApiPaths.GET_CLUSTER, {username: username, name: name}, {}, authData.getHeaders())
    .then((results: any[]) => {
      if (results.length == 1) {
        return results[0]
      }
      return undefined
    })
  }

  public getClustersForUser(username: string, authData: AuthData) {
    return this.clientCommunicator.get(ApiPaths.GET_CLUSTER_FOR_USER, {username: username}, {}, authData.getHeaders())
  }

  public deleteCluster(username: string, name: string, authData: AuthData) {
    return this.clientCommunicator.delete(ApiPaths.DELETE_CLUSTER, {username: username, name: name}, {}, authData.getHeaders())
  }
}
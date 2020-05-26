import { ClientCommunicator } from "../Communicator/ClientCommunicator";
import { ApiPaths } from "../Api/ApiPaths";

export class ClusterClient {

  constructor(private clientCommunicator: ClientCommunicator) {

  }

  public addCluster(data: any) {
    return this.clientCommunicator.post(ApiPaths.ADD_CLUSTER, data)
  }

  public getCluster(username: string, name: string) {
    return this.clientCommunicator.get(ApiPaths.GET_CLUSTER, {username: username, name: name})
    .then((results: any[]) => {
      if (results.length == 1) {
        return results[0]
      }
      return undefined
    })
  }

  public getClustersForUser(username: string) {
    return this.clientCommunicator.get(ApiPaths.GET_CLUSTER_FOR_USER, {username: username})
  }

  public deleteCluster(username: string, name: string) {
    return this.clientCommunicator.delete(ApiPaths.DELETE_CLUSTER, {username: username, name: name})
  }
}
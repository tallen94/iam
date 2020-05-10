import { ClientCommunicator } from "../Communicator/ClientCommunicator";
import { ApiPaths } from "../Api/ApiPaths";

export class EnvironmentClient {

  constructor(private clientCommunicator: ClientCommunicator) {

  }

  public addEnvironment(data: any) {
    return this.clientCommunicator.post(ApiPaths.ADD_ENVIRONMENT, data)
  }

  public getEnvironment(username: string, name: string, cluster: string) {
    return this.clientCommunicator.get(ApiPaths.GET_ENVIRONMENT, {username: username, name: name, cluster: cluster})
  }

  public getEnvironmentForUser(username: string) {
    return this.clientCommunicator.get(ApiPaths.GET_ENVIRONMENT_FOR_USER, {username: username})
  }

  public getEnvironmentForCluster(username: string, cluster: string) {
    return this.clientCommunicator.get(ApiPaths.GET_ENVIRONMENT_FOR_CLUSTER, {username: username, cluster: cluster})
  }

  public deleteEnvironment(username: string, name: string, cluster: string) {
    return this.clientCommunicator.delete(ApiPaths.DELETE_ENVIRONMENT, {username: username, name: name, cluster: cluster})
  }
}
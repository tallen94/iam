import { ClientCommunicator } from "../Communicator/ClientCommunicator";
import { ApiPaths } from "../Api/ApiPaths";
import { AuthData } from "../Auth/AuthData";

export class EnvironmentClient {

  constructor(private clientCommunicator: ClientCommunicator) {

  }

  public addEnvironment(data: any, authData: AuthData) {
    return this.clientCommunicator.post(ApiPaths.ADD_ENVIRONMENT, data, {}, authData.getHeaders())
  }

  public getEnvironment(username: string, name: string, cluster: string, authData: AuthData) {
    return this.clientCommunicator.get(ApiPaths.GET_ENVIRONMENT, {username: username, name: name, cluster: cluster}, {}, authData.getHeaders())
  }

  public getEnvironmentForUser(username: string, authData: AuthData) {
    return this.clientCommunicator.get(ApiPaths.GET_ENVIRONMENT_FOR_USER, {username: username}, {}, authData.getHeaders())
  }

  public getEnvironmentForCluster(username: string, cluster: string, authData: AuthData) {
    return this.clientCommunicator.get(ApiPaths.GET_ENVIRONMENT_FOR_CLUSTER, {username: username, cluster: cluster}, {}, authData.getHeaders())
  }

  public deleteEnvironment(username: string, name: string, cluster: string, authData: AuthData) {
    return this.clientCommunicator.delete(ApiPaths.DELETE_ENVIRONMENT, {username: username, name: name, cluster: cluster}, {}, authData.getHeaders())
  }

  public startEnvironment(username: string, name: string, cluster: string, authData: AuthData) {
    return this.clientCommunicator.post(ApiPaths.START_ENVIRONMENT, {username: username, name: name, cluster: cluster}, {}, authData.getHeaders())
  }

  public stopEnvironment(username: string, name: string, cluster: string, authData: AuthData) {
    return this.clientCommunicator.post(ApiPaths.STOP_ENVIRONMENT, {username: username, name: name, cluster: cluster}, {}, authData.getHeaders())
  }

  public getEndpoints(username: string, name: string, cluster: string, authData: AuthData) {
    return this.clientCommunicator.get(ApiPaths.GET_ENDPOINTS, {username: username, name: name, cluster: cluster}, {}, authData.getHeaders())
  }
}
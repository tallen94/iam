import {
  ClientCommunicator,
  ApiPaths
} from "../modules";

export class Client {
  private clientCommunicator: ClientCommunicator;

  constructor(clientCommunicator: ClientCommunicator) {
    this.clientCommunicator = clientCommunicator;
  }

  public addExecutable(data: any, authData: any) {
    return this.clientCommunicator.post(ApiPaths.ADD_EXECUTABLE, data, authData)
  }

  public getExecutable(username: string, cluster: string, environment: string, exe: string, name: string, authData: any) {
    return this.clientCommunicator.get(ApiPaths.GET_EXECUTABLE, {}, {username: username, cluster: cluster, environment: environment, name: name, exe: exe}, authData);
  }

  public getExecutables(username: string, exe: string, authData: any) {
    return this.clientCommunicator.get(ApiPaths.GET_EXECUTABLES, {}, {username: username, exe: exe}, authData);
  }

  public runExecutable(username: string, cluster: string, environment: string, exe: string, name: string, data: any, authData: any) {
    return this.clientCommunicator.post(ApiPaths.RUN_EXECUTABLE, data, {username: username, cluster: cluster, environment: environment, exe: exe, name: name}, authData);
  }

  public deleteExecutable(username: string, cluster: string, environment: string, exe: string, name: string, authData: any) {
    return this.clientCommunicator.delete(ApiPaths.DELETE_EXECUTABLE, {}, {username: username, cluster: cluster, environment: environment, exe: exe, name: name}, authData)
  }

  public searchExecutables(searchText: string) {
    return this.clientCommunicator.get(ApiPaths.SEARCH_EXECUTABLES, {searchText: searchText})
  }

  public spawn(name: string, data: any) {
    return this.clientCommunicator.post(ApiPaths.SPAWN_PROCESS, data, { name: name });
  }

  public getHost() {
    return this.clientCommunicator.getHost();
  }

  public getPort() {
    return this.clientCommunicator.getPort();
  }

  public getStatus(): Promise<any> {
    return this.clientCommunicator.get(ApiPaths.GET_STATUS);
  }
}
import {
  ClientCommunicator,
  ApiPaths
} from "../modules";

export class Client {
  private clientCommunicator: ClientCommunicator;

  constructor(clientCommunicator: ClientCommunicator) {
    this.clientCommunicator = clientCommunicator;
  }

  public spawn(name: string, data: any) {
    return this.clientCommunicator.post(ApiPaths.SPAWN_PROCESS, data, { name: name });
  }

  public addExecutable(data: any) {
    return this.clientCommunicator.post(ApiPaths.ADD_EXECUTABLE, data)
  }

  public getExecutable(username: string, exe: string, name: string) {
    return this.clientCommunicator.get(ApiPaths.GET_EXECUTABLE, {username: username, name: name, exe: exe});
  }

  public getExecutables(username: string, exe: string) {
    return this.clientCommunicator.get(ApiPaths.GET_EXECUTABLES, {username: username, exe: exe});
  }

  public runExecutable(username: string, exe: string, name: string, data: any, token: string) {
    return this.clientCommunicator.post(ApiPaths.RUN_EXECUTABLE, data, {username: username, exe: exe, name: name}, {token: token});
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
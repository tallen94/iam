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

  public runExecutable(type: string, name: string, data: any) {
    return this.clientCommunicator.post(ApiPaths.RUN_EXECUTABLE, data, { type: type, name: name });
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
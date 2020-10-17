import {
  ClientCommunicator,
  ApiPaths
} from "../modules";

export class ExecutorClient {

  constructor(private clientCommunicator: ClientCommunicator) { }

  public runExecutable(username: string, cluster: string, environment: string, exe: string, name: string, data: any) {
    return this.clientCommunicator.post(ApiPaths.RUN_EXECUTABLE, data, {username: username, cluster: cluster, environment: environment, exe: exe, name: name});
  }
}
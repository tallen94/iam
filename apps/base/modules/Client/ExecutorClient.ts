import {
  ClientCommunicator,
  ApiPaths
} from "../modules";
import { AuthData } from "../Auth/AuthData";

export class ExecutorClient {

  constructor(private clientCommunicator: ClientCommunicator) { }

  public runExecutable(username: string, cluster: string, environment: string, exe: string, name: string, data: any, authData: AuthData) {
    return this.clientCommunicator.post(ApiPaths.RUN_EXECUTABLE, data, {username: username, cluster: cluster, environment: environment, exe: exe, name: name}, authData.getHeaders());
  }
}
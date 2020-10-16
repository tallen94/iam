import {
  ClientCommunicator,
  ApiPaths
} from "../modules";

export class ExecutableClient {

  constructor(private clientCommunicator: ClientCommunicator) { }

  public runExecutable(executable: any, data: any) {
    return this.clientCommunicator.post(ApiPaths.RUN_EXECUTABLE, { executable: executable, data: data });
  }
}
import { ClientCommunicator } from "./ClientCommunicator";

export class FileSystemCommunicator {

  private clientCommunicator: ClientCommunicator;

  constructor(clientCommunicator) {
    this.clientCommunicator = clientCommunicator;
  }

  public getProgram(name: string) {
    return this.clientCommunicator.get("/programs/" + name);
  }

  public putProgram(program: any) {
    return this.clientCommunicator.post("/programs", program);
  }
}
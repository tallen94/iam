import { ClientCommunicator } from "./ClientCommunicator";

export class FileSystemCommunicator {

  private clientCommunicator: ClientCommunicator;

  constructor(clientCommunicator) {
    this.clientCommunicator = clientCommunicator;
  }

  public getFile(folder: string, name: string) {
    return this.clientCommunicator.get("/" + folder + "/" + name);
  }

  public putFile(folder: string, file: any) {
    return this.clientCommunicator.post("/" + folder, file)
  }
}
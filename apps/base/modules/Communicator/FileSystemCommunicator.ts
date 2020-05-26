import { ClientCommunicator } from "./ClientCommunicator";

export class FileSystemCommunicator {

  private clientCommunicator: ClientCommunicator;

  constructor(clientCommunicator) {
    this.clientCommunicator = clientCommunicator;
  }

  public getFile(folder: string, name: string): Promise<any> {
    return this.clientCommunicator.get("/fs/" + folder + "/" + name)
  }

  public putFile(folder: string, file: any) {
    return this.clientCommunicator.post("/fs/" + folder, file)
  }

  public deleteFile(folder: string, name: string): Promise<any> {
    return this.clientCommunicator.delete("/fs/" + folder + "/" + name)
  }
}
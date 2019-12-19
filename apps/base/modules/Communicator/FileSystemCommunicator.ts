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

  public getImage(name: string) {
    return this.clientCommunicator.get("/images/" + name);
  }

  public putImage(image: any) {
    return this.clientCommunicator.post("/images", image)
  }
}
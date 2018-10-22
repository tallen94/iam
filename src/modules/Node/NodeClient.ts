import {
  ClientCommunicator
} from "../modules";

export class NodeClient {
  private clientCommunicator: ClientCommunicator;

  constructor(clientCommunicator: ClientCommunicator) {
    this.clientCommunicator = clientCommunicator;
  }

  public getStatus(id?: number): Promise<any> {
    return this.clientCommunicator.post("status", { id: id });
  }

  public update(file: any, id?: number): Promise<any> {
    return this.clientCommunicator.post("update", { file: file, thread: id });
  }

  public runCommand(command: string, threads: number): Promise<any> {
    const data = {
      command: command,
      threads: threads
    };
    return this.clientCommunicator.post("command", data);
  }

  public runCommandList(commandList: string[]): Promise<any> {
    const data = {
      list: commandList
    };
    return this.clientCommunicator.post("commands", data);
  }

  public static fromData(data: any): NodeClient {
    const obj = data.clientCommunicator;
    const host = obj.host;
    const clientCommunicator = new ClientCommunicator(host);
    return new NodeClient(clientCommunicator);
  }
}
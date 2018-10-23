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

  public addCommand(name: string, command: string, id?: number) {
    return this.clientCommunicator.post("addCommand", { name: name, command: command, id: id });
  }

  public runCommand(commandName: string, args: string[], threads: number): Promise<any> {
    const data = {
      commandName: commandName,
      args: args,
      threads: threads
    };
    return this.clientCommunicator.post("command", data);
  }

  public runArglist(commandName: string, argList: string[][]): Promise<any> {
    const data = {
      commandName: commandName,
      argList: argList
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
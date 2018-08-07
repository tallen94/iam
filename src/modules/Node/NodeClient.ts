import * as Lodash from "lodash";

import {
  ClientCommunicator
} from "../modules";

export class NodeClient {
  private clientCommunicator: ClientCommunicator;

  constructor(clientCommunicator: ClientCommunicator) {
    this.clientCommunicator = clientCommunicator;
  }

  public getStatus(thread?: number): Promise<any> {
    return this.clientCommunicator.post("getStatus", { thread: thread });
  }

  public getAddress(thread?: number) {
    return this.clientCommunicator.post("getAddress", { thread: thread });
  }

  public update(file: any, thread?: number): Promise<any> {
    return this.clientCommunicator.post("update", { file: file, thread: thread });
  }

  public execute(command: string, threads: number): Promise<any> {
    const data = {
      command: command,
      threads: threads
    };
    return this.clientCommunicator.post("execute", data);
  }

  public static fromData(data: any): NodeClient {
    const obj = data.clientCommunicator;
    const host = obj.host;
    const clientCommunicator = new ClientCommunicator(host);
    return new NodeClient(clientCommunicator);
  }
}
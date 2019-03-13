import {
  NodeShell,
  Node,
  ShellCommunicator,
  ClientCommunicator,
  NodeClient
} from "../modules";

export class NodeFactory {
  public getNodeShell(): Node {
    const shellCommunicator: ShellCommunicator = new ShellCommunicator();
    const nodeShell: NodeShell = new NodeShell(shellCommunicator);
    return nodeShell;
  }

  public getNodeClient(host: string, port: number): Node {
    const clientCommunicator: ClientCommunicator = new ClientCommunicator(host, port);
    const nodeClient: NodeClient = new NodeClient(clientCommunicator);
    return nodeClient;
  }
}
import {
  NodeShell,
  NodeClient,
  NodeApi,
  Node,
  NodeManager,
  ServerCommunicator,
  ClientCommunicator,
  ShellCommunicator,
  FileSystem
} from "../modules";

export class NodeFactory {

  public constructor() { }

  public createNodeApi(id: number, filesRoot: string, port: number, nextAddress: string) {
    const client: NodeClient = this.createNodeClient(nextAddress);
    const shell: NodeShell = this.createNodeShell();
    const nodeServer = new ServerCommunicator(port);
    const nodeFileSystem = new FileSystem(filesRoot);
    const node = new Node(id, shell, client, nodeFileSystem);
    const nodeManager = new NodeManager(node);
    return new NodeApi(nodeManager, nodeServer);
  }

  public createNodeClient(address: string): NodeClient {
    const clientCommunicator: ClientCommunicator = new ClientCommunicator(address);
    const nodeClient: NodeClient = new NodeClient(clientCommunicator);
    return nodeClient;
  }

  public createNodeShell(): NodeShell {
    const shellCommunicator: ShellCommunicator = new ShellCommunicator();
    const nodeShell: NodeShell = new NodeShell(shellCommunicator);
    return nodeShell;
  }
}
import * as Lodash from "lodash";

import {
  NodeShell,
  NodeClient,
  NodeApi,
  Node,
  ServerCommunicator,
  ClientCommunicator,
  ShellCommunicator,
  FileSystem
} from "../modules";

export class NodeFactory {
  private servers: NodeApi[];
  private imagesRoot: string;
  private programsRoot: string;

  public constructor(imagesRoot: string, programsRoot: string) {
    this.servers = [];
    this.imagesRoot = imagesRoot;
    this.programsRoot = programsRoot;
  }

  public createNodeCluster(size) {
    for (let i = 0; i < size; i++) {
      const nextIndex = i == size - 1 ? 0 : i + 1;
      const client: NodeClient = this.createNodeClient("localhost", 5000 + nextIndex);
      const shell: NodeShell = this.createNodeShell();
      const server: NodeApi = this.createNodeApi(i, 5000 + i, shell, client);
      this.servers.push(server);
    }
  }

  public startCluster() {
    return Promise.all(Lodash.map(this.servers, (server: NodeApi) => {
      return server.serve();
    }));
  }

  public createNodeApi(id: number, port: number, shell: NodeShell, next: NodeClient): NodeApi {
    const nodeServer = new ServerCommunicator(port);
    const imageFileSystem = new FileSystem(this.imagesRoot);
    const programFileSystem = new FileSystem(this.programsRoot);
    const node = new Node(id, shell, next, imageFileSystem, programFileSystem);
    const nodeApi = new NodeApi(node, nodeServer);
    return nodeApi;
  }

  public createNodeClient(domain: string, port: number): NodeClient {
    const address = "http://" + domain + ":" + port;
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
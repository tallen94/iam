import * as Lodash from "lodash";

import {
  NodeShell,
  NodeClient,
  NodeApi,
  Node,
  ServerCommunicator,
  ClientCommunicator,
  ShellCommunicator
} from "../modules";

export class Cluster {
  private servers: NodeApi[];

  public constructor(size: number) {
    this.servers = [];

    for (let i = 0; i < size; i++) {
      const nextIndex = i == size - 1 ? 0 : i + 1;
      const client: NodeClient = Cluster.createClient("localhost", 5000 + i);
      const shell: NodeShell = Cluster.createShell();
      const server: NodeApi = Cluster.createServer(i, "localhost", 5000 + nextIndex, shell, client);
      this.servers.push(server);
    }
  }

  public startCluster() {
    return Promise.all(Lodash.map(this.servers, (server: NodeApi) => {
      return server.serve();
    }));
  }

  public static createServer(index: number, domain: string, port: number, shell: NodeShell, next: NodeClient): NodeApi {
    const address = "http://" + domain + ":" + port;
    const nodeServer = new ServerCommunicator(port);
    const node = new Node(index, address, shell, next);
    const nodeApi = new NodeApi(node, nodeServer);
    return nodeApi;
  }

  public static createClient(domain: string, port: number): NodeClient {
    const address = "http://" + domain + ":" + port;
    const clientCommunicator: ClientCommunicator = new ClientCommunicator(address);
    const nodeClient: NodeClient = new NodeClient(clientCommunicator);
    return nodeClient;
  }

  public static createShell(): NodeShell {
    const shellCommunicator: ShellCommunicator = new ShellCommunicator();
    const nodeShell: NodeShell = new NodeShell(shellCommunicator);
    return nodeShell;
  }
}
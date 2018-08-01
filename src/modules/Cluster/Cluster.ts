import * as Lodash from "lodash";

import {
  NodeClient,
  NodeApi,
  Node,
  ServerCommunicator,
  ClientCommunicator
} from "../modules";

export class Cluster {
  private servers: NodeApi[];
  private head: NodeClient;

  public constructor(size: number) {
    this.servers = [];
    this.head = this.createClient(0);

    for (let i =  size - 1; i >= 0; i--) {
      const index = i == size - 1 ? 0 : i + 1;
      const client: NodeClient = this.createClient(i);
      const server: NodeApi = this.createServer(index, i, client);
      this.servers.push(server);
    }
  }

  public getHead() {
    return this.head;
  }

  public startCluster() {
    return Promise.all(Lodash.map(this.servers, (server: NodeApi) => {
      return server.serve();
    }));
  }

  private createServer(index: number, thread: number, next?: NodeClient): NodeApi {
    const nodeAddress = this.getAddress(index);
    const nodeServer = new ServerCommunicator(this.getPort(index));
    const node = new Node(thread, nodeAddress, next);
    const nodeApi = new NodeApi(node, nodeServer);
    return nodeApi;
  }

  private createClient(index: number): NodeClient {
    const clientCommunicator: ClientCommunicator = new ClientCommunicator(this.getAddress(index));
    const nodeClient: NodeClient = new NodeClient(clientCommunicator);
    return nodeClient;
  }

  private getName(port: number) {
    return "localhost"; // "iam" + index;
  }

  private getPort(index: number) {
    return 5000 + index;
  }

  private getAddress(index: number) {
    return "http://" + this.getName(index) + ":" + this.getPort(index);
  }
}
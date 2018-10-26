import * as Path from "path";

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

  public constructor() { }

  public createNodeApi(nodeRoot: string) {
    const config = require(Path.join(nodeRoot, "config.json"));
    const client: NodeClient = this.createNodeClient(config["next"], config["port"]);
    const shell: NodeShell = this.createNodeShell();
    const nodeServer = new ServerCommunicator(config["port"]);
    const nodeFileSystem = new FileSystem(nodeRoot);
    const node = new Node(config["id"], shell, client, nodeFileSystem);
    return new NodeApi(node, nodeServer);
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
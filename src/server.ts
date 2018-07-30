import * as Lodash from "lodash";

import {
  NodeClient,
  NodeApi,
  Node,
  ServerCommunicator,
  ClientCommunicator
} from "./modules/modules";

for (let i = 0; i < 5; i++) {
  const server: NodeApi = createServer(i);
  server.serve().then(() => {
    console.log("Started deploy: " + i);
  });
}

function createServer(nodeIndex: number): NodeApi {
  const nodeAddress = getAddress(nodeIndex);
  const nodeServer = new ServerCommunicator(getPort(nodeIndex));
  const nextClient = new ClientCommunicator(getAddress(nodeIndex == 4 ? 0 : nodeIndex + 1));
  const nextNode = new NodeClient(nextClient);
  const node = new Node(nodeAddress, nextNode);
  const nodeApi = new NodeApi(node, nodeServer);
  return nodeApi;
}

function getName(index: number) {
  return "localhost"; // "iam" + index;
}

function getPort(index: number) {
  return 5000 + index;
}

function getAddress(index: number) {
  return "http://" + getName(index) + ":" + getPort(index);
}



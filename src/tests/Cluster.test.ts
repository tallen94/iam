import * as Lodash from "lodash";
import Config from "../config.json";

import {
  NodeFactory,
  Node,
  ClientCommunicator,
  NodeClient
} from "../modules/modules";

const NUM_NODES = 5;
const nodeFactory = new NodeFactory(Config["imagesRoot"], Config["programsRoot"]);
const headClient = new ClientCommunicator("http://localhost:5000");
const headNode = new NodeClient(headClient);

it("should start " + NUM_NODES + " servers with status OK", () => {
  nodeFactory.createNodeCluster(NUM_NODES);
  return nodeFactory.startCluster().then((nodes: Node[]) => {
    expect(nodes.length).toBe(NUM_NODES);
  });
});

it("should obtain " + NUM_NODES + " statuses", () => {
  return headNode.getStatus().then((statuses: string[]) => {
    expect(statuses.length).toBe(NUM_NODES);
    Lodash.each(statuses, (status: string) => {
      expect(status).toBe("OK");
    });
  });
});
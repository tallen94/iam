import * as Lodash from "lodash";
import {
  Cluster,
  Node,
  ClientCommunicator,
  NodeClient
} from "../modules/modules";

const NUM_NODES = 5;
const cluster = new Cluster(NUM_NODES);
const headClient = new ClientCommunicator("http://localhost:5000");
const headNode = new NodeClient(headClient);

it("should start " + NUM_NODES + " servers with status OK", () => {
  return cluster.startCluster().then((nodes: Node[]) => {
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
import {
  Cluster,
  Node
} from "../modules/modules";

const NUM_NODES = 5;
const cluster = new Cluster(NUM_NODES);

it("should start " + NUM_NODES + " servers with status OK", () => {
  return cluster.startCluster().then((nodes: Node[]) => {
    expect(nodes.length).toBe(NUM_NODES);
  });
});

it("should obtain " + NUM_NODES + " statuses", () => {
  return cluster.getHead().getStatus().then((statuses: string[]) => {
    expect(statuses.length).toBe(NUM_NODES);
  });
});

it("should obtain " + NUM_NODES + " addresses", () => {
  return cluster.getHead().getAddress().then((addresses: string[]) => {
    expect(addresses.length).toBe(NUM_NODES);
  });
});
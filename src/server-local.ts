import {
  NodeFactory
} from "./modules/modules";

const nodeFactory = new NodeFactory();
nodeFactory.createNodeCluster(5);
nodeFactory.startCluster().then(() => {
  console.log("Started");
});
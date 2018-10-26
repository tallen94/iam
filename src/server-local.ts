import Config from "/home/pi/iam/config.json";

import {
  NodeFactory
} from "./modules/modules";

const nodeFactory = new NodeFactory(Config["imagesRoot"], Config["programsRoot"], Config["configRoot"]);
nodeFactory.createNodeCluster(5);
nodeFactory.startCluster().then(() => {
  console.log("Started");
});
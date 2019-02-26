import * as Path from "path";
import {
  NodeFactory
} from "./modules/modules";

const HOME = "/Users/Trevor/iam/iam";
const config = require(Path.join(HOME, "local-config.json"));
const nodeFactory = new NodeFactory();
// nodeFactory.createNodeApi(config["id"], HOME, config["port"], config["nextAddress"])
// .serve()
// .then(() => { console.log("Started"); });

const numNodes = 5;
for (let i = 0; i < numNodes; i++) {
  const id = i;
  const port = 5000 + i;
  const nextHost = "localhost";
  const nextPort = i == (numNodes - 1) ? 5000 : port + 1;
  const nextAddress = "http://" + nextHost + ":" + nextPort;
  const nodeApi = nodeFactory.createNodeApi(id, HOME, port, nextAddress);
  nodeApi.serve().then(() => { console.log("Started"); });
}


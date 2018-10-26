import {
  NodeFactory
} from "./modules/modules";

const HOME = "/home/pi/iam";
const nodeFactory = new NodeFactory();
nodeFactory
.createNodeApi(HOME)
.serve()
.then(() => { console.log("Started"); });
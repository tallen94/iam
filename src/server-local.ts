import {
  NodeFactory
} from "./modules/modules";

const HOME = "/Users/Trevor/iam/iam";
const nodeFactory = new NodeFactory();
const nodeApi = nodeFactory.createNodeApi(HOME);
nodeApi.serve().then(() => { console.log("Started"); });


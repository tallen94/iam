import * as Path from "path";
import {
  NodeFactory
} from "./modules/modules";

const HOME = "/home/pi/iam";
const config = require(Path.join(HOME, "config.json"));
const nodeFactory = new NodeFactory();
nodeFactory.createNodeApi(config["id"], HOME, config["port"], config["nextAddress"])
.serve()
.then(() => { console.log("Started"); });
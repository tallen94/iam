import * as Lodash from "lodash";

import {
  NodeClient,
  ClientCommunicator
} from "./modules/modules";

const communicator = new ClientCommunicator("http://iam/");
const nodeClient = new NodeClient(communicator);

const nodes = ["iam0", "iam1", "iam2", "iam3"];

Promise.all(Lodash.map(nodes, (node: string) => {
  console.log("Updating...");
  // return nodeClient.execute("echo hello > out.txt").then((out: string) => {
  //   console.log(out);
  // });
}));

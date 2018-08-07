import * as Config from "./config.json";
import * as IP from "ip";

import {
  Cluster,
  NodeApi,
  NodeClient,
  NodeShell
} from "./modules/modules";

const index =  Config["index"];
const client: NodeClient = Cluster.createClient(IP.address(), 5000);
const shell: NodeShell = Cluster.createShell();
const server: NodeApi = Cluster.createServer(index, IP.address(), 5000, shell, client);

server.serve().then(() => {
  console.log("Started");
});

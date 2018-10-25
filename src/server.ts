import IP from "ip";
import FS from "fs";
import Config from "./config.json";
import Path from "path";

import {
  NodeFactory,
  NodeApi,
  NodeClient,
  NodeShell,
  Database
} from "./modules/modules";

const db = new Database();
const nodeFactory = new NodeFactory();
db.connect("mysql", "a8VEZyQUTn5wZuuN", "192.168.0.24", "iam")
.then(() => {
  return Config["id"] === "" ?
    db.procedure("CALL addNode(?,?)", { "host": IP.address(), "port": 5000 }) :
    db.procedure("CALL getNode(?)", { "id" : Config["id"] } );
}).then((data: any) => {
  const row = data[0][0];
  const id = row["id"];
  const port = row["port"];
  const nextHost = row["nextHost"];
  const nextPort = row["nextPort"];
  FS.writeFileSync(Path.join(__dirname, "config.json"), JSON.stringify({ "id": id }));

  const client: NodeClient = nodeFactory.createNodeClient(nextHost, nextPort);
  const shell: NodeShell = nodeFactory.createNodeShell();
  const server: NodeApi = nodeFactory.createNodeApi(id, port, shell, client);
  server.serve().then(() => {
    console.log("Started");
  });
});
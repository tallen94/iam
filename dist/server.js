"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config = require("./config.json");
const IP = require("ip");
const modules_1 = require("./modules/modules");
const index = Config["index"];
const client = modules_1.Cluster.createClient(IP.address(), 5000);
const shell = modules_1.Cluster.createShell();
const server = modules_1.Cluster.createServer(index, IP.address(), 5000, shell, client);
server.serve().then(() => {
    console.log("Started");
});
//# sourceMappingURL=server.js.map
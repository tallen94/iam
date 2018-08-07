"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const modules_1 = require("./modules/modules");
const cluster = new modules_1.Cluster(5);
cluster.startCluster().then(() => {
    console.log("Started");
});
//# sourceMappingURL=server-local.js.map
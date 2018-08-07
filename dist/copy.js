"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lodash = require("lodash");
const modules_1 = require("./modules/modules");
const communicator = new modules_1.ClientCommunicator("http://iam/");
const nodeClient = new modules_1.NodeClient(communicator);
const nodes = ["iam0", "iam1", "iam2", "iam3"];
Promise.all(Lodash.map(nodes, (node) => {
    return nodeClient.execute("scp ~/deploy-1.0.0.tgz " + node + ":");
})).then((results) => {
    console.log(results);
});
//# sourceMappingURL=copy.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Lodash = require("lodash");
var modules_1 = require("./modules/modules");
var communicator = new modules_1.ClientCommunicator("http://iam/");
var nodeClient = new modules_1.NodeClient(communicator);
var nodes = ["iam0", "iam1", "iam2", "iam3"];
Promise.all(Lodash.map(nodes, function (node) {
    console.log("Updating...");
    // return nodeClient.execute("echo hello > out.txt").then((out: string) => {
    //   console.log(out);
    // });
}));
//# sourceMappingURL=execute.js.map
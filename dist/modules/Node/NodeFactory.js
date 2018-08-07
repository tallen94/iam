"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const modules_1 = require("../modules");
class NodeFactory {
    static CreateNServers(n) {
        for (let i = n - 1; i >= 0; i--) {
            const index = i == n - 1 ? 0 : i + 1;
            const client = NodeFactory.CreateClient(i);
            const server = NodeFactory.CreateServer(index, i, client);
            server.serve().then((node) => {
                console.log(node);
                console.log("Started deploy: " + i);
            });
        }
    }
    static CreateServer(index, thread, next) {
        const nodeAddress = this.getAddress(index);
        const nodeServer = new modules_1.ServerCommunicator(this.getPort(index));
        const node = new modules_1.Node(thread, nodeAddress, next);
        const nodeApi = new modules_1.NodeApi(node, nodeServer);
        return nodeApi;
    }
    static CreateClient(index) {
        const clientCommunicator = new modules_1.ClientCommunicator(this.getAddress(index));
        const nodeClient = new modules_1.NodeClient(clientCommunicator);
        return nodeClient;
    }
    static getName(port) {
        return "localhost"; // "iam" + index;
    }
    static getPort(index) {
        return 5000 + index;
    }
    static getAddress(index) {
        return "http://" + this.getName(index) + ":" + this.getPort(index);
    }
}
exports.NodeFactory = NodeFactory;
//# sourceMappingURL=NodeFactory.js.map
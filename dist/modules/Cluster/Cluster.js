"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lodash = require("lodash");
const modules_1 = require("../modules");
class Cluster {
    constructor(size) {
        this.servers = [];
        for (let i = 0; i < size; i++) {
            const nextIndex = i == size - 1 ? 0 : i + 1;
            const client = Cluster.createClient("localhost", 5000 + i);
            const shell = Cluster.createShell();
            const server = Cluster.createServer(i, "localhost", 5000 + nextIndex, shell, client);
            this.servers.push(server);
        }
    }
    startCluster() {
        return Promise.all(Lodash.map(this.servers, (server) => {
            return server.serve();
        }));
    }
    static createServer(index, domain, port, shell, next) {
        const address = "http://" + domain + ":" + port;
        const nodeServer = new modules_1.ServerCommunicator(port);
        const node = new modules_1.Node(index, address, shell, next);
        const nodeApi = new modules_1.NodeApi(node, nodeServer);
        return nodeApi;
    }
    static createClient(domain, port) {
        const address = "http://" + domain + ":" + port;
        const clientCommunicator = new modules_1.ClientCommunicator(address);
        const nodeClient = new modules_1.NodeClient(clientCommunicator);
        return nodeClient;
    }
    static createShell() {
        const shellCommunicator = new modules_1.ShellCommunicator();
        const nodeShell = new modules_1.NodeShell(shellCommunicator);
        return nodeShell;
    }
}
exports.Cluster = Cluster;
//# sourceMappingURL=Cluster.js.map
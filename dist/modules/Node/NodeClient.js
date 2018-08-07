"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const modules_1 = require("../modules");
class NodeClient {
    constructor(clientCommunicator) {
        this.clientCommunicator = clientCommunicator;
    }
    getStatus(thread) {
        return this.clientCommunicator.post("getStatus", { thread: thread });
    }
    getAddress(thread) {
        return this.clientCommunicator.post("getAddress", { thread: thread });
    }
    update(file, thread) {
        return this.clientCommunicator.post("update", { file: file, thread: thread });
    }
    execute(command, threads) {
        const data = {
            command: command,
            threads: threads
        };
        return this.clientCommunicator.post("execute", data);
    }
    static fromData(data) {
        const obj = data.clientCommunicator;
        const host = obj.host;
        const clientCommunicator = new modules_1.ClientCommunicator(host);
        return new NodeClient(clientCommunicator);
    }
}
exports.NodeClient = NodeClient;
//# sourceMappingURL=NodeClient.js.map
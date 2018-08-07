"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lodash = require("lodash");
const modules_1 = require("../modules/modules");
const NUM_NODES = 5;
const cluster = new modules_1.Cluster(NUM_NODES);
const headClient = new modules_1.ClientCommunicator("http://localhost:5000");
const headNode = new modules_1.NodeClient(headClient);
it("should start " + NUM_NODES + " servers with status OK", () => {
    return cluster.startCluster().then((nodes) => {
        expect(nodes.length).toBe(NUM_NODES);
    });
});
it("should obtain " + NUM_NODES + " statuses", () => {
    return headNode.getStatus().then((statuses) => {
        expect(statuses.length).toBe(NUM_NODES);
        Lodash.each(statuses, (status) => {
            expect(status).toBe("OK");
        });
    });
});
it("should obtain " + NUM_NODES + " addresses", () => {
    return headNode.getAddress().then((addresses) => {
        expect(addresses.length).toBe(NUM_NODES);
    });
});
//# sourceMappingURL=Cluster.test.js.map
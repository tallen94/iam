"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const modules_1 = require("../modules/modules");
const server0 = modules_1.NodeFactory.CreateServer(2, 0);
const client0 = modules_1.NodeFactory.CreateClient(2);
const server1 = modules_1.NodeFactory.CreateServer(1, 1);
const client1 = modules_1.NodeFactory.CreateClient(1);
const server2 = modules_1.NodeFactory.CreateServer(0, 2);
const client2 = modules_1.NodeFactory.CreateClient(0);
it("should create a server with status OK", () => __awaiter(this, void 0, void 0, function* () {
    server0.serve().then((node) => {
        expect(node.getStatus()).toBe("OK");
    });
}));
it("should execute 'echo DONE' once with one thread", () => __awaiter(this, void 0, void 0, function* () {
    client0.execute("echo Done", 1).then((res) => {
        expect(res.length).toBe(1);
        expect(res[0]).toBe("DONE");
    });
}));
it("should execute 'echo DONE' thrice with three threads", () => __awaiter(this, void 0, void 0, function* () {
    client0.execute("echo Done", 3).then((res) => {
        expect(res.length).toBe(3);
        expect(res[0]).toBe("DONE");
        expect(res[1]).toBe("DONE");
        expect(res[2]).toBe("DONE");
    });
}));
it("should properly link two servers together", () => __awaiter(this, void 0, void 0, function* () {
    server0.getNode().setNext(client1);
    server1.getNode().setNext(client0);
    client0.getAddress().then((res) => {
        expect(res.length).toBe(2);
    });
}));
it("should properly link 3 servers together", () => __awaiter(this, void 0, void 0, function* () {
    server0.getNode().setNext(client1);
    server1.getNode().setNext(client2);
    server2.getNode().setNext(client0);
    client0.getAddress().then((res) => {
        expect(res.length).toBe(3);
    });
}));
//# sourceMappingURL=NodeFactory.test.js.map
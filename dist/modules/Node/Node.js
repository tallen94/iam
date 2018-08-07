"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Node {
    constructor(thread, address, shell, next) {
        this.thread = thread;
        this.address = address;
        this.status = "OK";
        this.shell = shell;
        this.next = next;
        this.stack = Promise.resolve();
    }
    getThread() {
        return this.thread;
    }
    getAddress() {
        return this.address;
    }
    getStatus() {
        return this.status;
    }
    setStatus(status) {
        this.status = status;
    }
    getNext() {
        return this.next;
    }
    getShell() {
        return this.shell;
    }
    getStack() {
        return this.stack;
    }
    addToStack(promise) {
        this.stack = this.stack.then((status) => {
            return promise;
        });
    }
}
exports.Node = Node;
//# sourceMappingURL=Node.js.map
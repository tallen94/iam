"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Express = require("express");
const Http = require("http");
const BodyParser = require("body-parser");
class ServerCommunicator {
    constructor(port) {
        this.port = port;
        this.api = Express();
        this.api.use(BodyParser.json());
        this.api.use(BodyParser.urlencoded({ extended: false }));
        this.server = Http.createServer(this.api);
    }
    getPort() {
        return this.port;
    }
    get(path, fn) {
        this.api.get(path, fn);
    }
    post(path, fn, middleware) {
        if (middleware) {
            this.api.post(path, middleware, fn);
        }
        else {
            this.api.post(path, fn);
        }
    }
    listen() {
        return new Promise((resolve, reject) => {
            this.api.listen(this.port, () => {
                resolve();
            });
        });
    }
}
exports.ServerCommunicator = ServerCommunicator;
//# sourceMappingURL=ServerCommunicator.js.map
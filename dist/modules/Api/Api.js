"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Express = require("express");
const Http = require("http");
const SocketIo = require("socket.io");
const BodyParser = require("body-parser");
class Api {
    constructor() {
        this.api = Express();
        this.socket = SocketIo();
        this.api.use(BodyParser.json());
        this.api.use(BodyParser.urlencoded({ extended: false }));
        this.server = Http.createServer(this.api);
        this.socket.attach(this.server);
    }
    useRouter(path, router) {
        console.log(path);
        this.api.use(path, router);
    }
    getRouter() {
        return Express.Router();
    }
    listen() {
        return new Promise((resolve, reject) => {
            this.api.listen(5000, () => {
                console.log("Api listening on " + 5000);
                resolve();
            });
        });
    }
}
exports.Api = Api;
//# sourceMappingURL=Api.js.map
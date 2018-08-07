"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lodash = require("lodash");
const modules_1 = require("../modules");
class Master {
    constructor(serverCommunicator) {
        this.serverCommunicator = serverCommunicator;
        this.applications = {};
        this.nodes = {};
        this.initApi();
    }
    initApi() {
        /**
         * path: /health/status
         * method: GET
         */
        this.serverCommunicator.get("/health/status", (req, res) => {
            res.status(200).send("OK");
        });
        /**
         * path: /createApp
         * method: POST
         * body: { name: string }
         */
        this.serverCommunicator.post("/createApp", (req, res) => {
            res.status(200).send({ msg: "received action" });
            const app = new modules_1.Application(req.body.name);
            this.applications[req.body.name] = app;
            Promise.all(Lodash.map(this.nodes, (node) => {
                // Send http request to node
                return Promise.resolve();
            }));
        });
        /**
         * path: /execute
         * method: POST
         * body: { command: string }
         */
        this.serverCommunicator.post("/execute", (req, res) => {
            Promise.all(Lodash.map(this.nodes, (node) => {
                return node.execute(req.body.command);
            })).then((results) => {
                res.status(200).send(results);
            });
        });
        /**
         * path: /nodeConnect
         * method: POST
         * body: { name: string }
         */
        this.serverCommunicator.post("/nodeConnect", (req, resp) => {
            const name = req.body.name;
            const communicator = new modules_1.ClientCommunicator("http://localhost:5001");
            const node = new modules_1.Node(name, communicator);
            this.nodes[name] = node;
            console.log("Node Connect");
            resp.status(200).send("Connected");
        });
        /**
         * path: /createdApp
         * body: { nodeName: string, name: string }
         */
        this.serverCommunicator.post("/createdApp", (req, res) => {
            this.nodes[req.body.nodeName].addApp(this.applications[req.body.name]);
        });
        this.serverCommunicator.listen();
    }
}
exports.Master = Master;
//# sourceMappingURL=Master.js.map
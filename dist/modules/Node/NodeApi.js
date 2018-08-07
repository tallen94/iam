"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lodash = require("lodash");
const Multer = require("multer");
class NodeApi {
    constructor(node, serverCommunicator) {
        this.node = node;
        this.serverCommunicator = serverCommunicator;
        this.storage = this.getStorageEngine();
        this.initApi();
    }
    initApi() {
        /**
         * Health check.
         *
         * path: /getStatus
         * method: POST
         * body: { thread?: number }
         */
        this.serverCommunicator.post("/getStatus", (req, res) => {
            const thread = req.body.thread;
            this.recurse(thread, () => {
                res.status(200).send({ data: [] });
            }, (thread) => {
                this.node.getNext().getStatus(thread)
                    .then((outList) => {
                    const resultList = Lodash.concat(outList, this.getNode().getStatus());
                    res.status(200).send({ data: resultList });
                });
            });
        });
        /**
         * Get name.
         *
         * path: /getAddress,
         * method: POST
         * body: { thread?: number }
         */
        this.serverCommunicator.post("/getAddress", (req, res) => {
            const thread = req.body.thread;
            this.recurse(thread, () => {
                res.status(200).send({ data: [] });
            }, (thread) => {
                this.node.getNext().getAddress(thread)
                    .then((outList) => {
                    const resultList = Lodash.concat(outList, this.getNode().getAddress());
                    res.status(200).send({ data: resultList });
                });
            });
        });
        /**
         * Update thy self.
         *
         * path: /update
         * method: POST
         * body: { package: file, thread?: number }
         */
        this.serverCommunicator.post("/update", (req, res) => {
            const thread = req.body.thread;
            this.recurse(thread, () => {
                res.status(200).send("Updated");
            }, (thread) => {
                this.node.getNext().update(req.body.package, thread)
                    .then(() => {
                    return this.node.getShell().npmInstall("~/iam/deploy.tgz");
                })
                    .then(() => {
                    res.status(200).send("Updated");
                    return this.node.getShell().restartProgram("deploy");
                });
            });
        }, Multer({ storage: this.storage }).single("package"));
        /**
         * Clone thy self.
         *
         * path: /clone
         * method: POST
         * body { address: string }
         */
        this.serverCommunicator.post("/clone", (req, res) => {
            const address = req.body.address;
            Promise.resolve()
                .then(() => {
                return Promise.all([
                    this.node.getShell().sshCp("~/iam/deploy.tgz", "iam/deploy.tgz", "pi", address, []),
                    this.node.getShell().sshCp("~/iam/deploy.service", "iam/deploy.service", "pi", address, [])
                ]);
            })
                .then(() => {
                return this.node.getShell().sshNpmInstall("/home/pi/iam/deploy.tgz", "pi", address);
            })
                .then(() => {
                return this.node.getShell().sshExecute("sudo cp ~/iam/deploy.service /etc/systemd/system/", "pi", address);
            })
                .then(() => {
                return this.node.getShell().sshRestartSystemDaemon("pi", address);
            })
                .then(() => {
                return this.node.getShell().sshStartProgram("deploy", "pi", address);
            })
                .then(() => {
                res.status(200).send("Cloned");
            });
        });
        /**
         * Execute a shell command concurrently over a number of threads.
         *
         * path: /execute
         * method: POST
         * body: { command: string, threads: number }
         */
        this.serverCommunicator.post("/execute", (req, resp) => {
            const command = req.body.command;
            const threads = req.body.threads;
            const promises = [this.node.getShell().execute(command)];
            if (req.body.threads > 1) {
                promises.push(this.node.getNext().execute(command, threads - 1));
            }
            const promise = Promise.all(promises)
                .then((outList) => {
                if (outList.length == 1) {
                    resp.status(200).send({ data: outList });
                }
                else {
                    const nodeResult = outList[0];
                    const nextResult = outList[1];
                    const resultList = Lodash.concat(nextResult, nodeResult);
                    resp.status(200).send({ data: resultList });
                }
            });
            this.node.addToStack(promise);
        });
    }
    recurse(thread, terminal, next) {
        if (thread == this.getNode().getThread()) {
            terminal();
        }
        else {
            if (thread == undefined) {
                thread = this.getNode().getThread();
            }
            next(thread);
        }
    }
    getStorageEngine() {
        return Multer.diskStorage({
            destination: (req, file, cb) => {
                cb(undefined, "/home/pi/iam");
            },
            filename: (req, file, cb) => {
                cb(undefined, "deploy.tgz");
            }
        });
    }
    serve() {
        return this.serverCommunicator.listen().then(() => {
            return this.node;
        });
    }
    getNode() {
        return this.node;
    }
}
exports.NodeApi = NodeApi;
//# sourceMappingURL=NodeApi.js.map
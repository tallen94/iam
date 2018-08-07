"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Request = require("request");
const Prompt = require("prompt");
const Lodash = require("lodash");
class CliTools {
    constructor() {
        this.commands = ["start", "stop", "restart",
            "deploy", "rollback", "install-config", "quit"];
        Prompt.start();
    }
    initPrompt() {
        console.log("Commands: (use cmd #)");
        Lodash.each(this.commands, (item, index) => {
            console.log(index + ") " + item);
        });
        Prompt.get(["cmd"], function (err, res) {
            const command = this.commands[res.cmd];
            this[command]();
        });
    }
    start() {
        console.log("Starting app");
        Prompt.get(["env"], function (err, res) {
            this.req(Lodash.merge(this.config["admin"][res.env]["command"], { json: { env: res.env, cmd: "start" } }));
        });
    }
    stop() {
        console.log("Stopping app");
        Prompt.get(["env"], function (err, res) {
            this.req(Lodash.merge(this.config["admin"][res.env]["command"], { json: { env: res.env, cmd: "stop" } }));
        });
    }
    restart() {
        console.log("Restarting app");
        Prompt.get(["env"], function (err, res) {
            this.req(Lodash.merge(this.config["admin"][res.env]["command"], { json: { env: res.env, cmd: "restart" } }));
        });
    }
    deploy() {
        console.log("Pulling new app");
        Prompt.get(["env"], function (err, res) {
            this.req(Lodash.merge(this.config["admin"][res.env]["command"], { json: { env: res.env, cmd: "deploy" } }));
        });
    }
    rollback() {
        console.log("Reverting app");
        Prompt.get(["env"], function (err, res) {
            this.req(Lodash.merge(this.config["admin"][res.env]["command"], { json: { env: res.env, cmd: "rollback" } }));
        });
    }
    installConfig() {
        console.log("Installing app");
        Prompt.get(["env"], function (err, res) {
            this.req(Lodash.merge(this.config["admin"][res.env]["command"], { json: { env: res.env, cmd: "install" } }));
        });
    }
    quit() {
        process.exit();
    }
    req(opts) {
        Request.post(opts, function (err, res, body) {
            if (err)
                throw err;
            console.log(res.body);
            console.log();
            this.initPrompt();
        });
    }
}
exports.CliTools = CliTools;
//# sourceMappingURL=CliTools.js.map
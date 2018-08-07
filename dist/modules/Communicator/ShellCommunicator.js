"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Shell = require("shelljs");
class ShellCommunicator {
    constructor() { }
    scp(source, destination, user, host, options) {
        return this.exec("scp " + options.join(" ") + " " + source + " " + user + "@" + host + ":" + destination);
    }
    sshCmd(user, host, command) {
        return this.exec("ssh " + user + "@" + host + " '" + command + "'");
    }
    exec(command) {
        return new Promise((resolve, reject) => {
            Shell.exec(command, (code, out, err) => {
                resolve(out);
            });
        });
    }
}
exports.ShellCommunicator = ShellCommunicator;
//# sourceMappingURL=ShellCommunicator.js.map
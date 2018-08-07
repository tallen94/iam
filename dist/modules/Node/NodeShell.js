"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NodeShell {
    constructor(shellCommunicator) {
        this.shellCommunicator = shellCommunicator;
    }
    sshExecute(command, user, host) {
        return this.shellCommunicator.exec("ssh " + user + "@" + host + " '" + command + "'");
    }
    sshNpmInstall(path, user, host) {
        return this.sshExecute("sudo npm i -g " + path, user, host);
    }
    sshCp(source, destination, user, host, options) {
        return this.shellCommunicator.scp(source, destination, user, host, options);
    }
    sshStartProgram(name, user, host) {
        return this.sshExecute("sudo systemctl start " + name, user, host);
    }
    sshRestartSystemDaemon(user, host) {
        return this.sshExecute("sudo systemctl daemon-reload", user, host);
    }
    execute(command) {
        return this.shellCommunicator.exec(command);
    }
    npmInstall(path) {
        return this.shellCommunicator.exec("sudo npm i -g " + path);
    }
    startProgram(name) {
        return this.shellCommunicator.exec("sudo systemctl start " + name);
    }
    restartProgram(name) {
        return this.shellCommunicator.exec("sudo systemctl restart " + name);
    }
}
exports.NodeShell = NodeShell;
//# sourceMappingURL=NodeShell.js.map
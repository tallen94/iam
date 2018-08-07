"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const Shell = require("shelljs");
class Git {
    constructor(config) {
        this.config = config;
    }
    pull() {
        Shell.cd(Path.join(__dirname, "..", "..", this.config.project_name));
        return new Promise((resolve, reject) => {
            Shell.exec("git pull", { silent: true }, (code, out, err) => {
                if (err)
                    reject(err);
                else
                    resolve(out);
            });
        });
    }
    getCommit() {
        Shell.cd(Path.join(__dirname, "..", "..", this.config.project_name));
        return new Promise((resolve, reject) => {
            Shell.exec("git rev-parse HEAD", { silent: true }, (code, out, err) => {
                if (err)
                    reject(err);
                else
                    resolve(out);
            });
        });
    }
    resetHead(commit) {
        Shell.cd(Path.join(__dirname, "..", "..", this.config.project_name));
        return new Promise((resolve, reject) => {
            Shell.exec("git reset --hard " + commit, { silent: true }, (code, out, err) => {
                if (err)
                    reject(err);
                else
                    resolve(out);
            });
        });
    }
}
exports.Git = Git;
//# sourceMappingURL=Git.js.map
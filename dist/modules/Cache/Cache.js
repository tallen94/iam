"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Shell = require("shelljs");
class Cache {
    constructor(config, db) {
        this.config = config;
        this.db = db;
    }
    newCache() {
        return new Promise((resolve, reject) => {
            Shell.exec("Docker/add_cache.sh", { silent: false }, (code, out, err) => {
                resolve(code);
            });
        });
    }
    deleteCache() {
        return new Promise((resolve, reject) => {
            Shell.exec("Docker/remove_cache.sh", { silent: false }, (code, out, err) => {
                resolve(code);
            });
        });
    }
    inspectCache(cache_name) {
        return new Promise((resolve, reject) => {
            Shell.exec("docker inspect " + cache_name, { silent: true }, (code, out, err) => {
                resolve(JSON.parse(out)[0]);
            });
        });
    }
    instances() {
        return this.db.procedure("get_asp_instances", [this.config.computer]);
    }
}
exports.Cache = Cache;
//# sourceMappingURL=Cache.js.map
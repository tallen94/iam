"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MySql = require("mysql");
class Database {
    constructor(config) {
        this.config = config;
        this.db = MySql.createConnection(this.config.db);
        this.db.on("error", function (err) { });
    }
    connect() {
        return new Promise((resolve, reject) => {
            this.db.connect((err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
    procedure(name, args) {
        return new Promise((resolve, reject) => {
            this.db.query(this.getProcedureString(name, args.length), args, (err, result) => {
                if (err)
                    reject(err);
                else
                    resolve(result);
            });
        });
    }
    query(query, args) {
        return new Promise((resolve, reject) => {
            this.db.query(query, args, (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
    getProcedureString(name, argsLen) {
        let argString = "?";
        for (let i = 0; i < argsLen - 1; i++) {
            argString = argString + ",?";
        }
        return "CALL " + name + "(" + argString + ")";
    }
}
exports.Database = Database;
exports.default = Database;
//# sourceMappingURL=Database.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    constructor(className) {
        this.className = className;
    }
    log(str) {
        console.log(new Date().toString() + " - " + str);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map
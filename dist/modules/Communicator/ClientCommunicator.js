"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Request = require("request");
class ClientCommunicator {
    constructor(host) {
        this.host = host;
    }
    get(url) {
        const absUrl = this.getAbsoluteUrl(url);
        return new Promise((resolve, reject) => {
            Request.get(absUrl, (err, response, body) => {
                resolve(JSON.parse(body).data);
            });
        });
    }
    post(url, data) {
        const absUrl = this.getAbsoluteUrl(url);
        return new Promise((resolve, reject) => {
            Request.post(absUrl, { form: data }, (err, response, body) => {
                resolve(JSON.parse(body).data);
            });
        });
    }
    getAbsoluteUrl(url) {
        return this.host + "/" + url;
    }
}
exports.ClientCommunicator = ClientCommunicator;
//# sourceMappingURL=ClientCommunicator.js.map
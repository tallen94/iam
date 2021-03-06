import Request from "request";
import Lodash from "lodash";

export class ClientCommunicator {
  private host: string;
  private port: number;

  constructor(host: string, port: number) {
    this.host = host;
    this.port = port;
  }

  public getHost() {
    return this.host;
  }

  public getPort() {
    return this.port;
  }

  public get(url: string, data?: any, params?: any, headers?: any) {
    const absUrl = this.getAbsoluteUrl(url, params);
    return new Promise((resolve, reject) => {
      const options = {
        method: "get",
        qs: data,
        json: true,
        url: absUrl,
        timeout: 9999999,
        headers: headers
      };
      Request(options, (err: any, response: Request.Response, body: any) => {
        if (err) {
          console.log(err);
        }
        resolve(body);
      });
    });
  }

  public post(url: string, data?: any, params?: any, headers?: any) {
    const absUrl = this.getAbsoluteUrl(url, params);
    return new Promise((resolve, reject) => {
      const options = {
        method: "POST",
        body: data,
        json: true,
        url: absUrl,
        timeout: 9999999,
        headers: headers
      };
      Request(options, (err: any, response: Request.Response, body: any) => {
        if (err) {
          console.log(err);
        }
        resolve(body);
      });
    });
  }

  public delete(url: string, data?: any, params?: any, headers?: any) {
    const absUrl = this.getAbsoluteUrl(url, params)
    return new Promise((resolve, reject) => {
      const options = {
        method: "DELETE",
        qs: data,
        json: true,
        url: absUrl,
        timeout: 99999999,
        headers: headers
      }
      Request(options, (err: any, response: Request.Response, body: any) => {
        if (err) {
          console.log(err);
        }
        resolve(body);
      });
    })
  }

  public postFormData(url: string, formData: any, params?: any) {
    const absUrl = this.getAbsoluteUrl(url, params);
    return new Promise((resolve, reject) => {
      const options = {
        method: "POST",
        json: true,
        url: absUrl,
        formData: formData,
        timeout: 9999999
      };
      Request(options, (err: any, response: Request.Response, body: any) => {
        if (err) {
          console.log(err);
        }
        resolve(body);
      });
    });
  }

  private replace(s: string, data: any): string {
    Lodash.each(data, (value, key) => {
      s = s.replace(":" + key, value);
    });
    return s;
  }

  private getAbsoluteUrl(url: string, params?: any) {
    const path = params == undefined ? url : this.replace(url, params);
    return "http://" + this.host + ":" + this.port + path;
  }
}
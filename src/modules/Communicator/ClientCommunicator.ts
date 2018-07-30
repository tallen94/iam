import * as Request from "request";

export class ClientCommunicator {
  private host: string;

  constructor(host: string) {
    this.host = host;
  }

  public get(url: string) {
    const absUrl = this.getAbsoluteUrl(url);
    return new Promise((resolve, reject) => {
      Request.get(absUrl, (err: any, response: Request.Response, body: any) => {
        resolve(JSON.parse(body).data);
      });
    });
  }

  public post(url: string, data?: any) {
    const absUrl = this.getAbsoluteUrl(url);
    return new Promise((resolve, reject) => {
      Request.post(absUrl, { form: data }, (err: any, response: Request.Response, body: any) => {
        resolve(JSON.parse(body).data);
      });
    });
  }

  private getAbsoluteUrl(url: string) {
    return this.host + "/" + url;
  }
}
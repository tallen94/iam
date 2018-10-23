import Request from "request";

export class ClientCommunicator {
  private host: string;

  constructor(host: string) {
    this.host = host;
  }

  public get(url: string) {
    const absUrl = this.getAbsoluteUrl(url);
    return new Promise((resolve, reject) => {
      const options = {
        method: "get",
        json: true,
        url: absUrl
      };
      Request(options, (err: any, response: Request.Response, body: any) => {
        resolve(body.data);
      });
    });
  }

  public post(url: string, data?: any) {
    const absUrl = this.getAbsoluteUrl(url);
    return new Promise((resolve, reject) => {
      const options = {
        method: "post",
        body: data,
        json: true,
        url: absUrl
      };
      Request(options, (err: any, response: Request.Response, body: any) => {
        resolve(body.data);
      });
    });
  }

  private getAbsoluteUrl(url: string) {
    return this.host + "/" + url;
  }
}
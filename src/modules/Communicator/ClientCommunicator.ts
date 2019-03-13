import Request from "request";

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

  public get(url: string) {
    const absUrl = this.getAbsoluteUrl(url);
    return new Promise((resolve, reject) => {
      const options = {
        method: "get",
        json: true,
        url: absUrl
      };
      Request(options, (err: any, response: Request.Response, body: any) => {
        if (err) {
          console.log(err);
        }
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
        if (err) {
          console.log(err);
        }
        resolve(body.data);
      });
    });
  }

  private getAbsoluteUrl(url: string) {
    return "http://" + this.host + ":" + this.port + url;
  }
}
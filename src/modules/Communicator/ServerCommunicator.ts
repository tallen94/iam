import * as Express from "express";
import * as Http from "http";
import * as BodyParser from "body-parser";
import { resolve } from "url";

export class ServerCommunicator {
  private api: Express.Application;
  private server: any;
  private port: number;

  constructor(port: number) {
    this.port = port;
    this.api = Express();
    this.api.use(BodyParser.json());
    this.api.use(BodyParser.urlencoded({extended: false}));
    this.server = Http.createServer(this.api);
  }

  public getPort(): number {
    return this.port;
  }

  public get(path: string, fn: (req: any, res: any) => void) {
    this.api.get(path, fn);
  }

  public post(path: string, fn: (req: any, res: any) => void, middleware?: any) {
    if (middleware) {
      this.api.post(path, middleware, fn);
    } else {
      this.api.post(path, fn);
    }
  }

  public listen() {
    return new Promise((resolve, reject) => {
      this.api.listen(this.port, () => {
        resolve();
      });
    });
  }
}
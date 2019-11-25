import Express from "express";
import Http from "http";
import BodyParser from "body-parser";
import Cors from "cors";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerCommunicator {
  private api: Express.Application;
  private port: number;

  constructor(port: number) {
    this.port = port;
    this.api = Express();
    this.api.use(Cors());
    this.api.use(BodyParser.json({limit: "100mb"}));
    this.api.use(BodyParser.urlencoded({extended: false, limit: "100mb"}));
    Http.createServer(this.api);
  }

  public static(fileDir: string, path?: string) {
    if (path == undefined) {
      this.api.use(Express.static(fileDir));
    } else {
      this.api.use(path, Express.static(fileDir));
    }
  }

  public get(path: string, fn: (req: any, res: any) => void) {
    this.api.get(path, fn);
  }

  public post(path: string, fn: (req: any, res: any) => void) {
    this.api.post(path, fn);
  }

  public listen() {
    return new Promise((resolve, reject) => {
      this.api.listen(this.port, () => {
        resolve();
      });
    });
  }
}
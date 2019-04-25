import Express from "express";
import Http from "http";
import BodyParser from "body-parser";

export class ServerCommunicator {
  private api: Express.Application;
  private port: number;
  private host: string;

  constructor(host: string, port: number, publicDir: string) {
    this.host = host;
    this.port = port;
    this.api = Express();
    this.api.use(BodyParser.json({limit: "100mb"}));
    this.api.use(BodyParser.urlencoded({extended: false, limit: "100mb"}));
    this.api.use(Express.static(publicDir));
    Http.createServer(this.api);
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
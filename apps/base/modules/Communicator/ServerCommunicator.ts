import Express from "express";
import Http, { Server } from "http";
import BodyParser from "body-parser";
import Cors from "cors";
import {Server as SocketServer, Socket} from "socket.io"

export class ServerCommunicator {
  private api: Express.Application;
  private server: Server;
  private port: number;
  private ioServer: SocketServer;

  constructor(port: number) {
    this.port = port;
    this.api = Express();
    this.api.use(Cors());
    this.api.use(BodyParser.json({limit: "100mb"}));
    this.api.use(BodyParser.urlencoded({extended: false, limit: "100mb"}));
    this.server = Http.createServer(this.api);
    this.server.timeout = 9999999
    this.ioServer = new SocketServer(this.server);
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

  public delete(path: string, fn: (req: any, res: any) => void) {
    this.api.delete(path, fn);
  }

  public use(fn: (req, res, next) => void) {
    this.api.use(fn)
  }

  public socketConnect(fn: (socket: Socket) => void) {
    this.ioServer.on("connection", fn)
  }
  
  public listen() {
    return new Promise((resolve, reject) => {
      this.server.listen(this.port, () => {
        resolve();
      });
    });
  }
}
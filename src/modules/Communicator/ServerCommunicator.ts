import Express from "express";
import Http from "http";
import BodyParser from "body-parser";
import Cors from "cors";
import FS from "fs";
import { FileSystem } from "../FileSystem/FileSystem";

export class ServerCommunicator {
  private api: Express.Application;
  private port: number;
  private host: string;
  private fileSystem: FileSystem;

  constructor(host: string, port: number, fileSystem: FileSystem) {
    this.host = host;
    this.port = port;
    this.fileSystem = fileSystem;
    this.api = Express();
    this.api.use(Cors());
    this.api.use(BodyParser.json({limit: "100mb"}));
    this.api.use(BodyParser.urlencoded({extended: false, limit: "100mb"}));
    this.setPublicInterface();
    this.setFileSystem();
    Http.createServer(this.api);
  }

  public getPort(): number {
    return this.port;
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

  private setPublicInterface() {
    this.api.use(Express.static(this.fileSystem.getPublicRoot()));
  }

  private setFileSystem() {
    this.api.use("/programs", Express.static(this.fileSystem.getProgramRoot()));
    this.post("/programs", (req, res) => {
      const path = this.fileSystem.getProgramRoot() + "/" + req.body.name;
      FS.createWriteStream(path).write(req.body.program);
      res.status(200).json({});
    });
  }
}
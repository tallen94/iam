import Multer from "multer";
import FS from "fs";

import {
  ServerCommunicator,
  ApiPaths,
  FileSystem,
  Executor
} from "../modules";

export class Api {
  private serverCommunicator: ServerCommunicator;
  private executor: Executor;
  private fileSystem: FileSystem;

  constructor(
    threadManager: Executor,
    serverCommunicator: ServerCommunicator,
    fileSystem: FileSystem) {
    this.executor = threadManager;
    this.serverCommunicator = serverCommunicator;
    this.fileSystem = fileSystem;
    this.initApi();
  }

  private initApi(): void {

    /**
     * Add new node to this cluster.
     *
     * path: /client
     * method: POST
     * body { host: string, port: number }
     */
    this.serverCommunicator.post(ApiPaths.ADD_CLIENT, (req: any, res: any) => {
      const host = req.body.host;
      const port = req.body.port;
      this.executor.addClientThread(host, port);
      res.status(200).send({ data: "Added Api Thread: " + this.executor.getClientPool().numClients() });
    });

    /**
     * Health check.
     *
     * path: /status
     * method: GET
     */
    this.serverCommunicator.get(ApiPaths.GET_STATUS, (req: any, res: any) => {
      this.executor.status()
      .then((result: any) => {
        res.status(200).send({
          shell: result[0],
          database: result[1],
          clients: result[2]
        });
      });
    });

    /**
     * Update thy self.
     *
     * path: /update
     * method: POST
     * body: { filename: string, package: file }
     */
    this.serverCommunicator.post(ApiPaths.UPDATE, (req: any, res: any) => {
      const filePath = this.fileSystem.path(req.body.filename);
      const pkg = FS.createReadStream(filePath);
      this.executor.update(pkg)
      .then((result: any) => {
        res.status(200).send({ shell: result[0], clients: result[1] });
      });
    }, Multer({ storage: this.fileSystem.getRootStorage() }).single("package"));
  }
}
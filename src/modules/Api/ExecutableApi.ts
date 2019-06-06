import Multer from "multer";

import {
  ServerCommunicator,
  ApiPaths,
  Executor
} from "../modules";
import { FileSystem } from "../FileSystem/FileSystem";

export class ExecutableApi {
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
     * Adds an executable to be executed on the node.
     *
     * path: /:type/:name
     * method: POST
     * body: { data: any, dataType: string, dataModel: any, userId: number }
     */
    this.serverCommunicator.post(ApiPaths.ADD_EXECUTABLE, (req: any, res: any) => {
      const name = req.params.name;
      const type = req.params.type;
      const data = req.body.data;
      const dataType = req.body.dataType;
      const dataModel = req.body.dataModel;
      const userId = req.body.userId;
      this.executor.addExecutable(type, name, data, dataType, dataModel, userId)
      .then((result: any) => {
        res.status(200).send({ shell: result[0], clients: result[1] });
      });
    }, Multer({ storage: this.fileSystem.getProgramStorage() }).single("program"));

    /**
     * Get an executable
     *
     * path: /:type/:name
     * method: GET
     */
    this.serverCommunicator.get(ApiPaths.GET_EXECUTABLE, (req: any, res: any) => {
      this.executor.getExecutable(req.params.type, req.params.name).then((result) => {
        res.status(200).send(result);
      });
    });

    /**
     * Get all executables
     *
     * path: /:type?userId=number
     * method: GET
     */
    this.serverCommunicator.get(ApiPaths.GET_EXECUTABLES, (req: any, res: any) => {
      this.executor.getExecutables(req.params.type, req.query.userId).then((results) => {
        res.status(200).send(results);
      });
    });

    /**
     * Execute an executable.
     *
     * path: /:type/:name/run
     * method: POST
     */
    this.serverCommunicator.post(ApiPaths.RUN_EXECUTABLE, (req: any, resp: any) => {
      const name = req.params.name;
      const type = req.params.type;
      const data = req.body;
      this.executor.runExecutable(type, name, data)
      .then((result: any) => {
        resp.status(200).send({ result: result});
      });
    });
  }
}
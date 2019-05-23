import Multer from "multer";
import FS from "fs";

import {
  ServerCommunicator,
  ApiPaths,
  FileSystem,
  Executor
} from "../modules";

export class ProgramApi {
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
     * Adds a program to be executed on the node.
     *
     * path: /program/:name
     * method: POST
     * body: {
     *  exe: string,
     *  filename: string,
     *  run: string,
     *  program: file,
     *  dataType: string,
     *  dataModel: any
     * }
     */
    this.serverCommunicator.post(ApiPaths.ADD_PROGRAM, (req: any, res: any) => {
      const name = req.params.name;
      const exe = req.body.exe;
      const filename = req.body.filename;
      const run = req.body.run;
      const filePath = this.fileSystem.programPath(filename);
      const program = FS.createReadStream(filePath);
      const dataType = req.body.dataType;
      const dataModel = req.body.dataModel;
      this.executor.addProgram(name, exe, filename, run, program, dataType, dataModel)
      .then((result: any) => {
        res.status(200).send({ shell: result[0], clients: result[1] });
      });
    }, Multer({ storage: this.fileSystem.getProgramStorage() }).single("program"));

    /**
     * Get a program
     *
     * path: /program/:name
     * method: GET
     */
    this.serverCommunicator.get(ApiPaths.GET_PROGRAM, (req: any, res: any) => {
      this.executor.getProgram(req.params.name).then((program) => {
        res.status(200).send(program);
      });
    });

    /**
     * Get all programs
     *
     * path: /program
     * method: GET
     */
    this.serverCommunicator.get(ApiPaths.GET_PROGRAMS, (req: any, res: any) => {
      this.executor.getPrograms().then((programs) => {
        res.status(200).send(programs);
      });
    });

    /**
     * Execute a program with a number of threads.
     *
     * path: /program/:name/run
     * method: POST
     */
    this.serverCommunicator.post(ApiPaths.RUN_PROGRAM, (req: any, resp: any) => {
      console.log("CLIENT: " + this.serverCommunicator.getPort());
      const name = req.params.name;
      const data = req.body;
      this.executor.getShell().runProgram(name, data)
      .then((result: any) => {
        resp.status(200).send(result);
      });
    });
  }
}
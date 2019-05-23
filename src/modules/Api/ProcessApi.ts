import Multer from "multer";

import {
  ServerCommunicator,
  ApiPaths,
  Executor
} from "../modules";
import { ProcessManager } from "../Process/ProcessManager";
import { Shell } from "../Executor/Shell";
import { LocalProcess } from "../Process/LocalProcess";
import { Database } from "../Executor/Database";
import { QueryProcess } from "../Process/QueryProcess";
import { Process } from "../Process/Process";
import { StepListManager } from "../Step/StepListManager";
import { Duplex } from "stream";
import { GenericDuplex } from "../Stream/GenericDuplex";

export class ProcessApi {
  private serverCommunicator: ServerCommunicator;
  private processManager: ProcessManager;
  private stepListManager: StepListManager;
  private shell: Shell;
  private database: Database;

  constructor(
    processManager: ProcessManager,
    serverCommunicator: ServerCommunicator,
    shell: Shell,
    database: Database) {
    this.processManager = processManager;
    this.serverCommunicator = serverCommunicator;
    this.shell = shell;
    this.database = database;
    this.initApi();
  }

  private initApi(): void {

    /**
     * Launch a process
     *
     * path: /process/:type/:name/spawn
     * method: POST
     */
    this.serverCommunicator.post(ApiPaths.SPAWN_PROCESS, (req: any, res: any) => {
      let duplex: Duplex;
      switch (req.params.type.toUpperCase()) {
        case "LOCAL":
          const command = this.shell.getProcess(req.params.name);
          const split = command.split(" ");
          const process = new LocalProcess(split[0], [split[1]]);
          process.spawn();
          duplex = process.stdout().pipe(new GenericDuplex({objectMode: true}));
          break;
        case "STEPLIST":
          duplex = this.stepListManager.spawn(req.params.name);
          break;
        // case "QUERY":
        //   const query = this.database.getQueryString(req.params.name);
        //   process = new QueryProcess(query, this.database.getConnection());
        //   break;
      }
      // req.pipe(process.spawn()).pipe(res);
    });

    /**
     * Write to process
     *
     * path: /process/:name/write
     * method: POST
     */
    this.serverCommunicator.post(ApiPaths.WRITE_PROCESS, (req: any, res: any) => {
      req.pipe(this.processManager.stdin(req.params.name));
      this.processManager.stdout(req.params.name).pipe(res);
    });
  }
}
import Multer from "multer";
import FS from "fs";

import {
  ServerCommunicator,
  ApiPaths,
  Cache,
  FileSystem,
  Executor
} from "../modules";

export class Api {
  private serverCommunicator: ServerCommunicator;
  private executor: Executor;
  private cache: Cache;
  private fileSystem: FileSystem;

  constructor(
    threadManager: Executor,
    serverCommunicator: ServerCommunicator,
    cache: Cache,
    fileSystem: FileSystem) {
    this.executor = threadManager;
    this.serverCommunicator = serverCommunicator;
    this.cache = cache;
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
        res.status(200).send({ shell: result[0], database: result[1], clients: result[2] });
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

    /**
     * Adds a program to be executed on the node.
     *
     * path: /program/:name
     * method: POST
     * body: {
     *  exe: string,
     *  filename: string,
     *  run: string,
     *  program: file
     * }
     */
    this.serverCommunicator.post(ApiPaths.ADD_PROGRAM, (req: any, res: any) => {
      const name = req.params.name;
      const exe = req.body.exe;
      const filename = req.body.filename;
      const run = req.body.run;
      const filePath = this.fileSystem.programPath(filename);
      const program = FS.createReadStream(filePath);
      this.executor.addProgram(name, exe, filename, this.fileSystem.getProgramRoot(), run, program)
      .then((result: any) => {
        res.status(200).send({ shell: result[0], clients: result[1] });
      });
    }, Multer({ storage: this.fileSystem.getProgramStorage() }).single("program"));


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
        this.cache.setValue(name, result);
        resp.status(200).send(result);
      });
    });

    /**
     * Adds a command to be executed on the node.
     *
     * path: /command/:name
     * method: POST
     * body: { command: string }
     */
    this.serverCommunicator.post(ApiPaths.ADD_COMMAND, (req: any, res: any) => {
      const name = req.params.name;
      const command = req.body.command;
      this.executor.addCommand(name, command)
      .then((result: any) => {
        res.status(200).send({ shell: result[0], clients: result[1] });
      });
    });

    /**
     * Execute a command.
     *
     * path: /command/:name/run
     * method: POST
     */
    this.serverCommunicator.post(ApiPaths.RUN_COMMAND, (req: any, resp: any) => {
      const name = req.params.name;
      const data = req.body;
      this.executor.getShell().runCommand(name, data)
      .then((result: any) => {
        this.cache.setValue(name, result);
        resp.status(200).send(result);
      });
    });

    /**
     * Add a query.
     *
     * path: /query/:name
     * method: POST
     * body: { query: string }
     */
    this.serverCommunicator.post(ApiPaths.ADD_QUERY, (req: any, res: any) => {
      const name = req.params.name;
      const query = req.body.query;
      this.executor.addQuery(name, query)
      .then((result: any) => {
        res.status(200).send({ database: result[0], clients: result[1] });
      });
    });

    /**
     * Execute a query.
     *
     * path: /query/:name/run
     * method: POST
     */
    this.serverCommunicator.post(ApiPaths.RUN_QUERY, (req: any, resp: any) => {
      const name = req.params.name;
      const data = req.body;
      this.executor.getDatabase().runQuery(name, data)
      .then((result: any) => {
        this.cache.setValue(name, result);
        resp.status(200).send(result);
      });
    });

    /**
     * Add an async step list.
     *
     * path: /stepList/async/:name
     * method: POST
     * body: { steps: any[] }
     */
    this.serverCommunicator.post(ApiPaths.ADD_ASYNC_STEP_LIST, (req: any, resp: any) => {
      const name = req.params.name;
      const steps = req.body.steps;
      this.executor.addAsyncStepList(name, steps);
      resp.status(200).send("Added StepList: " + name);
    });

    /**
     * Add a sync step list.
     *
     * path: /stepList/sync/:name
     * method: POST
     * body: { steps: any[] }
     */
    this.serverCommunicator.post(ApiPaths.ADD_SYNC_STEP_LIST, (req: any, resp: any) => {
      const name = req.params.name;
      const steps = req.body.steps;
      this.executor.addSyncStepList(name, steps);
      resp.status(200).send("Added StepList: " + name);
    });

    /**
     * Run a step list.
     *
     * path: /stepList/:name
     * method: POST
     */
    this.serverCommunicator.post(ApiPaths.RUN_STEP_LIST, (req: any, resp: any) => {
      const name = req.params.name;
      const data = req.body;
      this.executor.getStepListManager().execute(name, data)
      .then((result) => {
        resp.status(200).send(result);
      });
    });
  }

  public serve(): Promise<any> {
    return this.serverCommunicator.listen();
  }
}
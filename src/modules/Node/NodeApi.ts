import Multer from "multer";

import {
  ServerCommunicator, NodeManager, Job
} from "../modules";

export class NodeApi {
  private serverCommunicator: ServerCommunicator;
  private nodeManager: NodeManager;

  constructor(nodeManager: NodeManager, serverCommunicator: ServerCommunicator) {
    this.nodeManager = nodeManager;
    this.serverCommunicator = serverCommunicator;
    this.initApi();
  }

  private initApi(): void {

    /**
     * Health check.
     *
     * path: /status
     * method: POST
     * body: { id?: number }
     */
    this.serverCommunicator.post("/status", (req: any, res: any) => {
      const id: number = req.body.id;
      this.nodeManager.status(id)
      .then((result: any) => {
        res.status(200).send({ data: result });
      });
    });

    /**
     * List jobs.
     *
     * path: /job
     * method: POST
     * body: { jobId?: jobId, id?: number }
     */
    this.serverCommunicator.post("/job", (req: any, res: any) => {
      const id: number = req.body.id;
      this.nodeManager.jobs(id)
      .then((result: any) => {
        res.status(200).send({ data: result });
      });
    });

    /**
     * Update thy self.
     *
     * path: /update
     * method: POST
     * body: { package: file, thread?: number }
     */
    this.serverCommunicator.post("/update", (req: any, res: any) => {
      const thread: number = req.body.thread;
      this.nodeManager.update(req.body.package, thread)
      .then((result: any) => {
        res.status(200).send({ data: result });
      });
    }, Multer({ storage: this.nodeManager.getNode().getFileSystem().getStorage() }).single("package"));

    /**
     * Clone thy self.
     *
     * path: /clone
     * method: POST
     * body { address: string }
     */
    this.serverCommunicator.post("/clone", (req: any, res: any) => {
      const address = req.body.address;
      this.nodeManager.clone(address).then((result: any) => {
        res.status(200).send({ data: result });
      });
    });

    /**
     * Adds a program to be executed on the node.
     *
     * path: /addProgram
     * method: POST
     * body: {
     *  programName: string,
     *  command: string,
     *  filename: string,
     *  program: file,
     *  id?: number
     * }
     */
    this.serverCommunicator.post("/addProgram", (req: any, res: any) => {
      const programName = req.body.programName;
      const command = req.body.command;
      const filename = req.body.filename;
      const program = req.body.program;
      const id: number = req.body.id;
      this.nodeManager.addProgram(programName, command, filename, program, id)
      .then((result: any) => {
        res.status(200).send({ data: result });
      });
    }, Multer({ storage: this.nodeManager.getNode().getFileSystem().getStorage() }).single("program"));


    /**
     * Execute a program with a number of threads.
     *
     * path: /runProgram
     * method: POST
     * body: { programName: string, args?: string[], threads: number }
     */
    this.serverCommunicator.post("/runProgram", (req: any, resp: any) => {
      this.nodeManager.runProgram(req.body.programName, req.body.args, req.body.threads)
      .then((result: any) => {
        resp.status(200).send({ data: result });
      });
    });

    /**
     * Execute a program with a list of different args.
     *
     * path: /runPrograms
     * method: POST
     * body: { programName: string, argsList: string[][] }
     */
    this.serverCommunicator.post("/runPrograms", (req: any, resp: any) => {
      this.nodeManager.runPrograms(req.body.programName, req.body.argsList)
      .then((result: any) => {
        resp.status(200).send({ data: result });
      });
    });

    /**
     * Adds a command to be executed on the node.
     *
     * path: /addCommand
     * method: POST
     * body: { commandName: string, command: string, id?: number }
     */
    this.serverCommunicator.post("/addCommand", (req: any, res: any) => {
      this.nodeManager.addCommand(req.body.commandName, req.body.command, req.body.id)
      .then((result: any) => {
        res.status(200).send({ data: result });
      });
    });

    /**
     * Execute a command with a number of threads.
     *
     * path: /runCommand
     * method: POST
     * body: { commandName: string, args?: string[], threads: number }
     */
    this.serverCommunicator.post("/runCommand", (req: any, resp: any) => {
      this.nodeManager.runCommand(req.body.commandName, req.body.args, req.body.threads)
      .then((result: any) => {
        resp.status(200).send({ data: result });
      });
    });

    /**
     * Execute a command with a list of different args.
     *
     * path: /runCommands
     * method: POST
     * body: { commandName: string, argsList: string[][] }
     */
    this.serverCommunicator.post("/runCommands", (req: any, resp: any) => {
      this.nodeManager.runCommands(req.body.commandName, req.body.argsList)
      .then((result: any) => {
        resp.status(200).send({ data: result });
      });
    });
  }

  public serve(): Promise<any> {
    return this.serverCommunicator.listen();
  }
}
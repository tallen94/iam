import Lodash from "lodash";
import Multer from "multer";

import {
  ServerCommunicator, Node, FileSystem
} from "../modules";

export class NodeApi {
  private node: Node;
  private serverCommunicator: ServerCommunicator;

  constructor(node: Node, serverCommunicator: ServerCommunicator) {
    this.node = node;
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
      this.recurse(id, () => {
        res.status(200).send({ data: [] });
      }, (id: number) => {
        this.node.getNext().getStatus(id)
        .then((outList: any[]) => {
          const resultList = Lodash.concat(outList, this.getNode().getStatus());
          res.status(200).send({ data: resultList });
        });
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
      this.recurse(thread, () => {
        res.status(200).send("Updated");
      }, (thread: number) => {
        this.node.getNext().update(req.body.package, thread)
        .then(() => {
          return this.node.getShell().npmInstall("~/iam/deploy.tgz");
        })
        .then(() => {
          res.status(200).send("Updated");
          return this.node.getShell().restartProgram("deploy");
        });
      });
    }, Multer({ storage: this.node.getImageFileSystem() }).single("package"));

    /**
     * Clone thy self.
     *
     * path: /clone
     * method: POST
     * body { address: string }
     */
    this.serverCommunicator.post("/clone", (req: any, res: any) => {
      const address = req.body.address;

      Promise.resolve()
      .then(() => { // Upload the program
        return Promise.all([
          this.node.getShell().sshCp("~/iam/deploy.tgz", "iam/deploy.tgz", "pi", address, []),
          this.node.getShell().sshCp("~/iam/deploy.service", "iam/deploy.service", "pi", address, [])
        ]);
      })
      .then(() => { // Install the program
        return this.node.getShell().sshNpmInstall("/home/pi/iam/deploy.tgz", "pi", address);
      })
      .then(() => { // move system file
        return this.node.getShell().sshExecute("sudo cp ~/iam/deploy.service /etc/systemd/system/", "pi", address);
      })
      .then(() => { // reload system daemon
        return this.node.getShell().sshRestartSystemDaemon("pi", address);
      })
      .then(() => { // start the program
        return this.node.getShell().sshStartProgram("deploy", "pi", address);
      })
      .then(() => {
        res.status(200).send("Cloned");
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
      const id: number = req.body.id;
      this.recurse(id, () => {
        res.status(200).send("Added program");
      }, (id: number) => {
        this.node.addProgram(programName, command, filename);
        return this.node.getNext().addProgram(programName, command, filename, req.body.program, id)
        .then(() => {
          res.status(200).send("Added program");
        });
      });
    }, Multer({ storage: this.node.getProgramFileSystem() }).single("program"));


    /**
     * Execute a program with a number of threads.
     *
     * path: /runProgram
     * method: POST
     * body: { programName: string, args?: string[], threads: number }
     */
    this.serverCommunicator.post("/runProgram", (req: any, resp: any) => {
      const programName = req.body.programName;
      const args = req.body.args;
      const threads = req.body.threads;

      const promises = [this.node.runProgram(programName, args)];
      if (req.body.threads > 1) {
        promises.push(this.node.getNext().runProgram(programName, args, threads - 1));
      }

      const promise = Promise.all(promises)
      .then((outList: any[]) => {
        if (outList.length == 1) {
          resp.status(200).send({ data: outList });
        } else {
          const nodeResult = outList[0];
          const nextResult = outList[1];
          const resultList = Lodash.concat(nextResult, nodeResult);
          resp.status(200).send({ data: resultList });
        }
      });

      this.node.addToStack(promise);
    });

    /**
     * Execute a program with a list of different args.
     *
     * path: /runPrograms
     * method: POST
     * body: { programName: string, argsList: string[][] }
     */
    this.serverCommunicator.post("/runPrograms", (req: any, resp: any) => {
      const argsList: string[][] = req.body.argsList;
      const programName: string = req.body.programName;
      const promises = [this.node.runProgram(programName, argsList.shift())];
      if (argsList.length >= 1) {
        promises.push(this.node.getNext().runPrograms(programName, argsList));
      }

      const promise = Promise.all(promises)
      .then((outList: any[]) => {
        if (outList.length == 1) {
          resp.status(200).send({ data: outList });
        } else {
          const nodeResult = outList[0];
          const nextResult = outList[1];
          const resultList = Lodash.concat(nextResult, nodeResult);
          resp.status(200).send({ data: resultList });
        }
      });

      this.node.addToStack(promise);
    });

    /**
     * Adds a command to be executed on the node.
     *
     * path: /addCommand
     * method: POST
     * body: { commandName: string, command: string, id?: number }
     */
    this.serverCommunicator.post("/addCommand", (req: any, res: any) => {
      const commandName = req.body.commandName;
      const command = req.body.command;
      const id: number = req.body.id;
      this.recurse(id, () => {
        res.status(200).send("Added command");
      }, (id: number) => {
        this.getNode().addCommand(commandName, command);
        return this.node.getNext().addCommand(commandName, command, id)
        .then(() => {
          res.status(200).send("Added command");
        });
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
      const commandName = req.body.commandName;
      const args = req.body.args;
      const threads = req.body.threads;

      const promises = [this.node.runCommand(commandName, args)];
      if (req.body.threads > 1) {
        promises.push(this.node.getNext().runCommand(commandName, args, threads - 1));
      }

      const promise = Promise.all(promises)
      .then((outList: any[]) => {
        if (outList.length == 1) {
          resp.status(200).send({ data: outList });
        } else {
          const nodeResult = outList[0];
          const nextResult = outList[1];
          const resultList = Lodash.concat(nextResult, nodeResult);
          resp.status(200).send({ data: resultList });
        }
      });

      this.node.addToStack(promise);
    });

    /**
     * Execute a command with a list of different args.
     *
     * path: /runCommands
     * method: POST
     * body: { commandName: string, argsList: string[][] }
     */
    this.serverCommunicator.post("/runCommands", (req: any, resp: any) => {
      const argsList: string[][] = req.body.argsList;
      const commandName: string = req.body.commandName;
      const promises = [this.node.runCommand(commandName, argsList.shift())];
      if (argsList.length >= 1) {
        promises.push(this.node.getNext().runCommands(commandName, argsList));
      }

      const promise = Promise.all(promises)
      .then((outList: any[]) => {
        if (outList.length == 1) {
          resp.status(200).send({ data: outList });
        } else {
          const nodeResult = outList[0];
          const nextResult = outList[1];
          const resultList = Lodash.concat(nextResult, nodeResult);
          resp.status(200).send({ data: resultList });
        }
      });

      this.node.addToStack(promise);
    });
  }

  private recurse(id: number, terminal: () => void, next: (thread: number) => void) {
    if (id == this.getNode().getId()) {
      terminal();
    } else {
      if (id == undefined) {
        id = this.getNode().getId();
      }
      next(id);
    }
  }

  public serve(): Promise<Node> {
    return this.serverCommunicator.listen().then(() => {
      return this.node;
    });
  }

  public getNode(): Node {
    return this.node;
  }
}
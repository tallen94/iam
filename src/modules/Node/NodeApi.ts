import Lodash from "lodash";
import Multer from "multer";

import {
  ServerCommunicator, Node
} from "../modules";

export class NodeApi {
  private node: Node;
  private serverCommunicator: ServerCommunicator;
  private storage: Multer.StorageEngine;

  constructor(node: Node, serverCommunicator: ServerCommunicator) {
    this.node = node;
    this.serverCommunicator = serverCommunicator;
    this.storage = this.getStorageEngine();
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
    }, Multer({ storage: this.storage }).single("package"));

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
     * Execute a shell command concurrently over a number of threads.
     *
     * path: /command
     * method: POST
     * body: { command: string, threads: number }
     */
    this.serverCommunicator.post("/command", (req: any, resp: any) => {
      const command = req.body.command;
      const threads = req.body.threads;

      const promises = [this.node.getShell().command(command)];
      if (req.body.threads > 1) {
        promises.push(this.node.getNext().runCommand(command, threads - 1));
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
     * Execute an array of commands.
     *
     * path: /commands
     * method: POST
     * body: { list: string[] }
     */
    this.serverCommunicator.post("/commands", (req: any, resp: any) => {
      const commandList: string[] = req.body.list;
      const promises = [this.node.getShell().command(commandList.shift())];
      if (commandList.length >= 1) {
        promises.push(this.node.getNext().runCommandList(commandList));
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

  private getStorageEngine(): Multer.StorageEngine {
    return Multer.diskStorage({
      destination: (req, file, cb) => {
        cb(undefined, "/home/pi/iam");
      },
      filename: (req, file, cb) => {
        cb(undefined, "deploy.tgz");
      }
    });
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
import * as Lodash from "lodash";
import * as Multer from "multer";
import * as Config from "../../config.json";

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
     * path: /getStatus
     * method: POST
     * body: { thread?: number }
     */
    this.serverCommunicator.post("/getStatus", (req: any, res: any) => {
      const thread: number = req.body.thread;
      this.recurse(thread, () => {
        res.status(200).send({ data: [] });
      }, (thread: number) => {
        this.node.getNext().getStatus(thread)
        .then((outList: any[]) => {
          const resultList = Lodash.concat(outList, this.getNode().getStatus());
          res.status(200).send({ data: resultList });
        });
      });
    });

    /**
     * Get name.
     *
     * path: /getAddress,
     * method: POST
     * body: { thread?: number }
     */
    this.serverCommunicator.post("/getAddress", (req: any, res: any) => {
      const thread: number = req.body.thread;
      this.recurse(thread, () => {
        res.status(200).send({ data: [] });
      }, (thread: number) => {
        this.node.getNext().getAddress(thread)
        .then((outList: any[]) => {
          const resultList = Lodash.concat(outList, this.getNode().getAddress());
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
          this.node.getShell().sshCp("~/iam/deploy/deploy.tgz", "iam/deploy.tgz", "pi", address, []),
          this.node.getShell().sshCp("~/iam/deploy/deploy.service", "iam/deploy.service", "pi", address, [])
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
     * path: /execute
     * method: POST
     * body: { command: string, threads: number }
     */
    this.serverCommunicator.post("/execute", (req: any, resp: any) => {
      const command = req.body.command;
      const threads = req.body.threads;

      const promises = [this.node.getShell().execute(command)];
      if (req.body.threads > 1) {
        promises.push(this.node.getNext().execute(command, threads - 1));
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

  private recurse(thread: number, terminal: () => void, next: (thread: number) => void) {
    if (thread == this.getNode().getThread()) {
      terminal();
    } else {
      if (thread == undefined) {
        thread = this.getNode().getThread();
      }
      next(thread);
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
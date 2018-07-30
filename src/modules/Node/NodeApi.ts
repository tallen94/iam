import * as Shell from "shelljs";
import * as Lodash from "lodash";
import * as UUID from "uuid";
import * as Multer from "multer";

import {
  ServerCommunicator, ClientCommunicator, NodeClient, Node
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
     * method: GET
     */
    this.serverCommunicator.get("/getStatus", (req: any, res: any) => {
      res.status(200).send({ data: this.node.getStatus() });
    });

    /**
     * Update thy self.
     *
     * path: /update
     * method: POST
     * body: { package: file }
     */
    this.serverCommunicator.post("/update", (req: any, res: any) => {
      this.node.execute("sudo npm i -g /home/pi/iam/deploy.tgz")
      .then((result) => {
        res.status(200).send("Updated");
        return this.node.execute("sudo systemctl restart deploy");
      });
    }, Multer({ storage: this.storage }).single("package"));

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

      const promises = [this.node.execute(command)];
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
}
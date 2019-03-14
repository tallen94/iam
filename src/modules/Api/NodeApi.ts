import Multer from "multer";

import {
  ServerCommunicator, NodeManager, NodeFactory, ApiPaths, Cache
} from "../modules";

export class NodeApi {
  private serverCommunicator: ServerCommunicator;
  private nodeManager: NodeManager;
  private nodeFactory: NodeFactory;
  private cache: Cache;

  constructor(nodeManager: NodeManager, nodeFactory: NodeFactory, serverCommunicator: ServerCommunicator, cache: Cache) {
    this.nodeManager = nodeManager;
    this.nodeFactory = nodeFactory;
    this.serverCommunicator = serverCommunicator;
    this.cache = cache;
    this.initApi();
  }

  private initApi(): void {

    /**
     * Add new node to this cluster.
     *
     * path: /addNodeClient
     * method: POST
     * body { host: string, port: number }
     */
    this.serverCommunicator.post(ApiPaths.ADD_NODE_CLIENT, (req: any, res: any) => {
      const host = req.body.host;
      const port = req.body.port;
      this.nodeManager.addNode(this.nodeFactory.getNodeClient(host, port));
      res.status(200).send({ data: "Added Node Client: " + this.nodeManager.nodeCount() });
    });

    /**
     * Add new node to this cluster.
     *
     * path: /addNodeShell
     * method: POST
     */
    this.serverCommunicator.post(ApiPaths.ADD_NODE_SHELL, (req: any, res: any) => {
      this.nodeManager.addNode(this.nodeFactory.getNodeShell());
      const serverCommunicator: ServerCommunicator = new ServerCommunicator(5000 + (this.nodeManager.nodeCount() - 1));
      const nodeApi: NodeApi = new NodeApi(this.nodeManager, this.nodeFactory, serverCommunicator, this.cache);
      nodeApi.serve().then(() => {
        res.status(200).send({ data: "Started" });
      });
    });

    /**
     * Health check.
     *
     * path: /status
     * method: GET
     */
    this.serverCommunicator.get(ApiPaths.GET_STATUS, (req: any, res: any) => {
      this.nodeManager.getStatus()
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
    this.serverCommunicator.post(ApiPaths.UPDATE, (req: any, res: any) => {
      const thread: number = req.body.thread;
      this.nodeManager.update(req.body.package, thread)
      .then((result: any) => {
        res.status(200).send({ data: result });
      });
    }, Multer({ storage: this.nodeManager.getFileSystem().getStorage() }).single("package"));

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
     *  index?: number
     * }
     */
    this.serverCommunicator.post(ApiPaths.ADD_PROGRAM, (req: any, res: any) => {
      const programName = req.body.programName;
      const command = req.body.command;
      const filename = req.body.filename;
      const program = req.body.program;
      const index = req.body.index;
      this.nodeManager.addProgram(programName, command, filename, program, index)
      .then((result: any) => {
        res.status(200).send({ data: result });
      });
    }, Multer({ storage: this.nodeManager.getFileSystem().getStorage() }).single("program"));


    /**
     * Execute a program with a number of threads.
     *
     * path: /runProgram
     * method: POST
     * body: { programName: string, args?: string[], index?: number }
     */
    this.serverCommunicator.post(ApiPaths.RUN_PROGRAM, (req: any, resp: any) => {
      const cache_key = JSON.stringify(req.body);
      this.cacheGet(cache_key, (value: any) => {
        resp.status(200).send({ data: value });
      }, () => {
        const programName = req.body.programName;
        const args = req.body.args;
        const index = req.body.index;
        this.nodeManager.runProgram(programName, args, index)
        .then((result: any) => {
          this.cache.setValue(cache_key, result);
          resp.status(200).send({ data: result });
        });
      });
    });

    /**
     * Adds a command to be executed on the node.
     *
     * path: /addCommand
     * method: POST
     * body: { commandName: string, command: string, index?: number }
     */
    this.serverCommunicator.post(ApiPaths.ADD_COMMAND, (req: any, res: any) => {
      const commandName = req.body.commandName;
      const command = req.body.command;
      const index = req.body.index;
      this.nodeManager.addCommand(commandName, command, index)
      .then((result: any) => {
        res.status(200).send({ data: result });
      });
    });

    /**
     * Execute a command with a number of threads.
     *
     * path: /runCommand
     * method: POST
     * body: { commandName: string, args?: string[], index?: number }
     */
    this.serverCommunicator.post(ApiPaths.RUN_COMMAND, (req: any, resp: any) => {
      const cache_key = JSON.stringify(req.body);
      this.cacheGet(cache_key, (value: any) => {
        resp.status(200).send({ data: value });
      }, () => {
        const commandName = req.body.commandName;
        const args = req.body.args;
        const index = req.body.index;
        this.nodeManager.runCommand(commandName, args, index)
        .then((result: any) => {
          this.cache.setValue(cache_key, result);
          resp.status(200).send({ data: result });
        });
      });
    });

    /**
     * Clears the cache.
     *
     * path: /clearCache
     * method: GET
     */
    this.serverCommunicator.get(ApiPaths.CLEAR_CACHE, (req: any, resp: any) => {
      this.cache.clearCache();
      resp.status(200).send("Cleared Cache");
    });
  }

  private cacheGet(key: string, hit: (value) => void, miss: () => void) {
    if (this.cache.getValue(key) == undefined) {
      miss();
    } else {
      hit(this.cache.getValue(key));
    }
  }

  public serve(): Promise<any> {
    return this.serverCommunicator.listen();
  }
}
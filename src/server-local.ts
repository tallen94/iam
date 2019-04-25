import {
  FileSystem, ClientPool, Api, ServerCommunicator, Executor
} from "./modules/modules";
import { ExecutableApi } from "./modules/Api/ExecutableApi";
import * as OS from "os";

const HOME = "/Users/Trevor/iam/iam";
const fileSystem: FileSystem = new FileSystem(HOME);
const dbconfig = require(fileSystem.path("db-config.json"));
const NUM_NODES = 5;
for (let i = 0; i < NUM_NODES; i++) {
  const host = "localhost";
  const port = 5000 + i;
  const clientThreadPool: ClientPool = new ClientPool();
  const threadManager: Executor = new Executor();
  threadManager.init(fileSystem, dbconfig, clientThreadPool)
  .then(() => {
    if (port == 5000) return threadManager.setClientPool(host, port);
    return Promise.resolve();
  })
  .then(() => {
    const serverCommunicator: ServerCommunicator = new ServerCommunicator(host, port, fileSystem.getPublicRoot());
    const api: Api = new Api(
      threadManager,
      serverCommunicator,
      fileSystem);
    const executableApi: ExecutableApi = new ExecutableApi(
      threadManager,
      serverCommunicator,
      fileSystem);
    return serverCommunicator.listen();
  }).then(() => { console.log("Started"); });
}


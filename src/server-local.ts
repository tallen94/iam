import {
  FileSystem, ClientPool, Api, ServerCommunicator, Executor
} from "./modules/modules";
import { ExecutableApi } from "./modules/Api/ExecutableApi";
import { ProcessManager } from "./modules/Process/ProcessManager";
import { ProcessApi } from "./modules/Api/ProcessApi";
import { JobRunner } from "./modules/Job/JobRunner";
import { Logger } from "./modules/Logger/Logger";

const HOME = "/Users/Trevor/iam/iam";
const fileSystem: FileSystem = new FileSystem(HOME);
const dbconfig = require(fileSystem.path("db-config.json"));
const fsConfig = require(fileSystem.path("fs-config.json"));
const NUM_NODES = 5;
for (let i = 0; i < NUM_NODES; i++) {
  const host = "localhost";
  const port = 5000 + i;
  const clientThreadPool: ClientPool = new ClientPool();
  const executor: Executor = new Executor();
  const processManager: ProcessManager = new ProcessManager();

  executor.init(fileSystem, dbconfig, fsConfig, clientThreadPool);
  executor.getDatabase().runQuery("get-node", {host: host, port: port})
  .then((result) => {
    const node = result[0];
    if (node.parent == undefined) {
      const jobRunner: JobRunner = new JobRunner(executor);
      jobRunner.start();
      executor.setJobRunner(jobRunner);
      return executor.setClientPool(host, port);
    }
    return Promise.resolve();
  }).then(() => {
    const serverCommunicator: ServerCommunicator = new ServerCommunicator(
      host,
      port,
      fileSystem);
    const processApi: ProcessApi = new ProcessApi(
      processManager,
      serverCommunicator,
      executor.getShell(),
      executor.getDatabase());
    const api: Api = new Api(
      executor,
      serverCommunicator,
      fileSystem);
    const executableApi: ExecutableApi = new ExecutableApi(
      executor,
      serverCommunicator,
      new Logger(executor));
    return serverCommunicator.listen();
  }).then(() => { console.log("Started"); });
}


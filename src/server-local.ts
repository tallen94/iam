import {
  FileSystem, ClientPool, Api, ServerCommunicator, Executor
} from "./modules/modules";
import { ExecutableApi } from "./modules/Api/ExecutableApi";
import { ProcessManager } from "./modules/Process/ProcessManager";
import { ProcessApi } from "./modules/Api/ProcessApi";
import { JobRunner } from "./modules/Job/JobRunner";

const HOME = "/Users/Trevor/iam/iam";
const fileSystem: FileSystem = new FileSystem(HOME);
const dbconfig = require(fileSystem.path("db-config.json"));
const NUM_NODES = 5;
for (let i = 0; i < NUM_NODES; i++) {
  const host = "localhost";
  const port = 5000 + i;
  const clientThreadPool: ClientPool = new ClientPool();
  const executor: Executor = new Executor();
  const processManager: ProcessManager = new ProcessManager();
  if (i == 0 ) {
    const jobRunner: JobRunner = new JobRunner(executor);
    jobRunner.start();
    executor.setJobRunner(jobRunner);
  }
  executor.init(fileSystem, dbconfig, clientThreadPool)
  .then(() => {
    if (port == 5000) return executor.setClientPool(host, port);
    return Promise.resolve();
  })
  .then(() => {
    const serverCommunicator: ServerCommunicator = new ServerCommunicator(host, port, fileSystem.getPublicRoot());
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
      fileSystem);
    return serverCommunicator.listen();
  }).then(() => { console.log("Started"); });
}


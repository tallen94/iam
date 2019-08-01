import {
  Executor, FileSystem, ClientPool, ServerCommunicator
} from "./modules/modules";
import { ExecutableApi } from "./modules/Api/ExecutableApi";
import { Api } from "./modules/Api/Api";
import * as OS from "os";
import { JobRunner } from "./modules/Job/JobRunner";
import { Logger } from "./modules/Logger/Logger";

const HOME = "/home/ubuntu/iam";
const fileSystem: FileSystem = new FileSystem(HOME);
const dbconfig = require(fileSystem.path("db-config.json"));
const fsconfig = require(fileSystem.path("fs-config.json"));
const host = getHost();
const port = 5000;
const clientThreadPool: ClientPool = new ClientPool();
const executor: Executor = new Executor();
executor.init(fileSystem, dbconfig, fsconfig, clientThreadPool);
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

function getHost() {
  const ifaces = OS.networkInterfaces();
  return ifaces["eth0"][0]["address"];
}
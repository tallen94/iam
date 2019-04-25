import {
  Executor, FileSystem, ClientPool, ServerCommunicator
} from "./modules/modules";
import { ExecutableApi } from "./modules/Api/ExecutableApi";
import { Api } from "./modules/Api/Api";
import * as OS from "os";

const HOME = "/home/pi/iam";
const fileSystem: FileSystem = new FileSystem(HOME);
const dbconfig = require(fileSystem.path("db-config.json"));
const host = getHost();
const port = 5000;
const clientThreadPool: ClientPool = new ClientPool();
const threadManager: Executor = new Executor();
threadManager.init(fileSystem, dbconfig, clientThreadPool)
.then(() => {
  if (port == 5000) return threadManager.setClientPool(host, port);
  return Promise.resolve();
}).then(() => {
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

function getHost() {
  const ifaces = OS.networkInterfaces();
  return ifaces["en0"][0]["address"];
}
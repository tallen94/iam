import {
  FileSystem, ClientPool, Api, ServerCommunicator, Executor, Cache
} from "./modules/modules";

const HOME = "/Users/Trevor/iam/iam";
const fileSystem: FileSystem = new FileSystem(HOME);
const cache: Cache = new Cache();
const dbconfig = require(fileSystem.path("db-config.json"));
const NUM_NODES = 5;
for (let i = 0; i < NUM_NODES; i++) {
  const clientThreadPool: ClientPool = new ClientPool();
  const threadManager: Executor = new Executor(fileSystem, dbconfig, clientThreadPool);
  const serverCommunicator: ServerCommunicator = new ServerCommunicator(5000 + i);
  const api: Api = new Api(
    threadManager,
    serverCommunicator,
    cache,
    fileSystem);
  api.serve().then(() => { console.log("Started"); });
}
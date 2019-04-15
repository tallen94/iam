import {
  Executor, FileSystem, ClientPool, Api, ServerCommunicator, Cache
} from "./modules/modules";


const HOME = "/home/pi/iam";
const fileSystem: FileSystem = new FileSystem(HOME);
const cache: Cache = new Cache();
const dbconfig = require(fileSystem.path("db-config.json"));
const clientThreadPool: ClientPool = new ClientPool();
const threadManager: Executor = new Executor(fileSystem, dbconfig, clientThreadPool);
const serverCommunicator: ServerCommunicator = new ServerCommunicator(5000);
const api: Api = new Api(
  threadManager,
  serverCommunicator,
  cache,
  fileSystem);
api.serve().then(() => { console.log("Started"); });
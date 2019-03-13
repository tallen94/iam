import {
  NodeFactory, FileSystem, NodeManager, NodeApi, ServerCommunicator, Cache
} from "./modules/modules";

const HOME = "/home/pi/iam";
const fileSystem: FileSystem = new FileSystem(HOME);
const nodeFactory: NodeFactory = new NodeFactory();
const cache: Cache = new Cache();
const nodeManager: NodeManager = new NodeManager(fileSystem, nodeFactory.getNodeShell());
const serverCommunicator: ServerCommunicator = new ServerCommunicator(5000);
const nodeApi: NodeApi = new NodeApi(nodeManager, nodeFactory, serverCommunicator, cache);
nodeApi.serve().then(() => { console.log("Started"); });
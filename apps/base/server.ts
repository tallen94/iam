import { ServerCommunicator, FileSystem, StatusApi } from "./modules/modules";
import { ApiFactory } from "./modules/Api/ApiFactory";

const TYPE = process.env.TYPE || process.argv[2];
const HOME = process.argv[3] || process.env.HOME;
const SERVER_PORT = process.env.SERVER_PORT || process.argv[4];

const fileSystem: FileSystem = new FileSystem(HOME, ["programs", "images", "kubernetes"]);
const serverCommunicator: ServerCommunicator = new ServerCommunicator(parseInt(SERVER_PORT));
const apiFactory: ApiFactory = new ApiFactory();
new StatusApi(serverCommunicator);
apiFactory[TYPE](fileSystem, serverCommunicator);
serverCommunicator.listen().then(() => {
  console.log("Started " + TYPE);
});
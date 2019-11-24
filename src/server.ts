import { ServerCommunicator, FileSystem } from "./modules/modules";
import { ApiFactory } from "./modules/Api/ApiFactory";

// COMMENT
const TYPE = process.env.TYPE;
const HOME = process.env.HOME;
const SERVER_PORT = process.env.SERVER_PORT;

const fileSystem: FileSystem = new FileSystem(HOME);
const serverCommunicator: ServerCommunicator = new ServerCommunicator(parseInt(SERVER_PORT));
const apiFactory: ApiFactory = new ApiFactory();
apiFactory[TYPE](fileSystem, serverCommunicator);
serverCommunicator.listen().then(() => {
  console.log("Started " + TYPE);
});
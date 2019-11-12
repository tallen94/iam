import { ServerCommunicator } from "../Communicator/ServerCommunicator";
import { FileSystem } from "../FileSystem/FileSystem";

export class DashboardApi {

  constructor(
    private fileSystem: FileSystem,
    private serverCommunicator: ServerCommunicator
  ) {
    this.init();
  }

  private init() {
    this.serverCommunicator.static(this.fileSystem.getPublicRoot());
  }
}
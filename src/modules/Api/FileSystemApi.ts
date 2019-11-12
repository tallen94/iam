import { ServerCommunicator } from "../Communicator/ServerCommunicator";
import { FileSystem } from "../FileSystem/FileSystem";
import * as FS from "fs";

export class FileSystemApi {

  constructor(
    private fileSystem: FileSystem,
    private serverCommunicator: ServerCommunicator
  ) {
    this.init();
  }

  private init() {
    // User local filesystem
    this.serverCommunicator.static(this.fileSystem.getProgramRoot(), "/programs");
    this.serverCommunicator.post("/programs", (req, res) => {
      const path = this.fileSystem.getProgramRoot() + "/" + req.body.name;
      FS.createWriteStream(path).write(req.body.program);
      res.status(200).json({});
    });
  }
}
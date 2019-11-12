import { ServerCommunicator } from "../Communicator/ServerCommunicator";
import { FileSystem } from "../FileSystem/FileSystem";
import * as FS from "fs";
import { FileSystemCommunicator } from "../Communicator/FileSystemCommunicator";

export class FileSystemApi {

  constructor(
    private fileSystem: FileSystem,
    private serverCommunicator: ServerCommunicator,
    private forwardCommunicator?: FileSystemCommunicator
  ) {
    this.init();
  }

  private init() {
    if (this.forwardCommunicator != undefined) {
      // Forward to another filesystem
      this.serverCommunicator.get("/programs/:name", (req, res) => {
        this.forwardCommunicator.getProgram(req.params.name).then((result) => {
          res.status(200).send(result);
        });
      });

      this.serverCommunicator.post("/programs", (req, res) => {
        this.forwardCommunicator.putProgram(req.body).then((result) => {
          res.status(200).send(result);
        });
      });
    } else {
      // User local filesystem
      this.serverCommunicator.static(this.fileSystem.getProgramRoot(), "/programs");
      this.serverCommunicator.post("/programs", (req, res) => {
        const path = this.fileSystem.getProgramRoot() + "/" + req.body.name;
        FS.createWriteStream(path).write(req.body.program);
        res.status(200).json({});
      });
    }
  }
}
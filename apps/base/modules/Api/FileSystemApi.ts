import { ServerCommunicator } from "../Communicator/ServerCommunicator";
import { FileSystem } from "../FileSystem/FileSystem";
import * as FS from "fs";
import * as Lodash from "lodash";

export class FileSystemApi {

  constructor(
    private fileSystem: FileSystem,
    private serverCommunicator: ServerCommunicator
  ) {
    this.init();
  }

  private init() {

    Lodash.each(this.fileSystem.getFolderNames(), (folderName) => {
      // User local filesystem
      this.serverCommunicator.static(this.fileSystem.getFolderRoot(folderName), "/" + folderName);
      this.serverCommunicator.post("/" + folderName, (req, res) => {
        const path = this.fileSystem.getFolderRoot(folderName) + "/" + req.body.name;
        FS.createWriteStream(path).write(req.body.file);
        res.status(200).json({});
      });
    })

    this.serverCommunicator.get("/files", (req, res) => {
      const files = Lodash.map(this.fileSystem.getFolderNames(), (folderName) => {
        return {
          folderName: folderName,
          files: this.fileSystem.getFiles(folderName)
        }
      })

      res.status(200).json(files)
    })
  }
}
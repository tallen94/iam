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
    this.serverCommunicator.get("/fs*", (req, res) => {
      this.fileSystem.get(req.params[0])
      .then((result) => {
        res.status(200).send(result)
      });
    });

    this.serverCommunicator.post("/fs*", (req, res) => {
      this.fileSystem.put(req.params[0], req.body.name, req.body.file)
      .then((err: any) => {
        if (err) {
          res.status(500).send(err)
        } else {
          res.status(200)
        }
      })
    });

    this.serverCommunicator.delete("/fs*", (req, res) => {
      this.fileSystem.delete(req.params[0])
      .then((err: any) => {
        if (err) {
          res.status(500).send(err)
        } else {
          res.status(200)
        }
      })
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
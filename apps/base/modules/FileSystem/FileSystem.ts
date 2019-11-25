import Multer from "multer";
import Path from "path";
import FS from "fs";

export class FileSystem {

  private root: string;
  private rootStorage: Multer.StorageEngine;
  private programStorage: Multer.StorageEngine;

  constructor(root: string) {
    this.root = root;
    this.rootStorage = Multer.diskStorage({
      destination: (req, file, cb) => {
        cb(undefined, this.getRoot());
      },
      filename: (req, file, cb) => {
        cb(undefined, file.originalname);
      }
    });
    this.initProgramPath();
    this.programStorage = Multer.diskStorage({
      destination: (req, file, cb) => {
        cb(undefined, this.path("programs"));
      },
      filename: (req, file, cb) => {
        cb(undefined, file.originalname);
      }
    });
  }

  private initProgramPath() {
    if (!FS.existsSync(this.getProgramRoot())) {
      FS.mkdirSync(this.getProgramRoot());
    }
  }

  public getRoot() {
    return this.root;
  }

  public getProgramRoot() {
    return this.path("programs");
  }

  public getPublicRoot() {
    return this.path("public/dist/iam");
  }

  public path(path: string) {
    return Path.join(this.root, path);
  }

  public programPath(fileName: string) {
    return Path.join(this.root, "programs", fileName);
  }

  public getRootStorage(): Multer.StorageEngine {
    return this.rootStorage;
  }

  public getProgramStorage(): Multer.StorageEngine {
    return this.programStorage;
  }

  public writeProgram(name: string, text: string) {
    const path = this.getProgramRoot() + "/" + name;
    if (!FS.existsSync(path)) {
      const write = FS.createWriteStream(path);
      write.write(text);
      write.close();
    }
    return path;
  }

  public deletePath(path: string) {
    FS.unlinkSync(path);
  }
}
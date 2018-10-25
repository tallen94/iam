import Multer from "multer";

export class FileSystem {

  private root: string;
  private storage: Multer.StorageEngine;

  constructor(root: string) {
    this.root = root;
    this.storage = Multer.diskStorage({
      destination: (req, file, cb) => {
        cb(undefined, root);
      },
      filename: (req, file, cb) => {
        cb(undefined, file.originalname);
      }
    });
  }

  public getStorage(): Multer.StorageEngine {
    return this.storage;
  }
}
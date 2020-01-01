import Path from "path";
import FS from "fs";
import Lodash from "lodash";

export class FileSystem {

  private root: string;
  private folderNames: string[];
  private folders: any;

  constructor(root: string, folderNames: string[]) {
    this.root = root;
    this.folderNames = folderNames;
    this.folders = {};
    this.setFolders(folderNames);
  }

  private setFolders(folders: string[]) {
    Lodash.each(folders, (folder) => {
      this.folders[folder] = {
        root: this.path(folder),
        path: (filename: string) => {
          return Path.join(this.root, folder, filename);
        }
      }
      this.writeDirectory(folder, "")
    })
  }

  public getFolderNames() {
    return this.folderNames;
  }

  public getRoot() {
    return this.root;
  }

  public path(path: string) {
    return Path.join(this.root, path);
  }

  public getPublicRoot() {
    return this.path("public/dist/iam");
  }

  public getFolderRoot(folder: string) {
    return this.folders[folder].root;
  }

  public folderPath(folder: string, filename: string) {
    return Path.join(this.folders[folder].root, filename);
  }

  public writeFolder(folder: string, filename: string, text: string) {
    const path = this.folderPath(folder, filename).toString();
    if (!FS.existsSync(path)) {
      const write = FS.createWriteStream(path);
      write.write(text);
      write.close();
    }
    return path;
  }

  public writeDirectory(folder: string, dirName: string) {
    const path = this.folderPath(folder, dirName).toString();
    if (!FS.existsSync(path)) {
      FS.mkdirSync(path)
    }
    return path;
  }

  public deletePath(path: string) {
    FS.unlinkSync(path);
  }
}
import Path from "path";
import FS from "fs";
import Lodash from "lodash";

export class FileSystem {

  private root: string;
  private folders: any;

  constructor(root: string, folders: string[]) {
    this.root = root;
    this.folders = this.getFolders(folders);
  }

  private getFolders(folders: string[]) {
    const folderMap = {};
    Lodash.each(folders, (folder) => {
      folderMap[folder] = {
        root: this.path(folder),
        path: (filename: string) => {
          return Path.join(this.root, folder, filename);
        }
      }
    })
    return folderMap;
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


  public getProgramRoot() {
    return this.getFolderRoot("programs");
  }

  public getImagesRoot() {
    return this.getFolderRoot("images")
  }

  public programPath(fileName: string) {
    return this.folderPath("programs", fileName);
  }

  public imagesPath(fileName: string) {
    return this.folderPath("images", fileName);
  }

  public writeProgram(name: string, text: string) {
    const path = this.folderPath("programs", name);
    if (!FS.existsSync(path)) {
      const write = FS.createWriteStream(path);
      write.write(text);
      write.close();
    }
    return path;
  }

  public writeImage(name: string, text: string) {
    const path = this.folderPath("images", name);
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
import { Executable } from "./Executable";
import { ShellCommunicator } from "../Communicator/ShellCommunicator";
import * as uuid from "uuid";
import { FileSystem } from "../FileSystem/FileSystem";
import * as Lodash from "lodash";

export class Function implements Executable {

  constructor(
    private username: string,
    private name: string,
    private visibility: string,
    private command: string,
    private args: string,
    private file: string,
    private shell: ShellCommunicator,
    private fileSystem: FileSystem
  ) { 

  }

  public getUsername() {
    return this.username
  }

  public getName(): string {
    return this.name
  }

  public getVisibility(): string {
    return this.visibility
  }

  public run(data: any): Promise<any> {
    const tmpName = uuid.v4()
    return this.fileSystem.put("programs", tmpName, this.file)
    .then((err: any) => {
      if (err) {
        return err;
      }
      const path = this.fileSystem.path("programs/" + tmpName);
      let run = this.command + " " + path;
      if (this.args != "") {
        const args = this.replace(this.args, data);
        run = run + " " + args;
      }
      return this.shell.exec(run, JSON.stringify(data))
      .then((result: any) => {
        this.fileSystem.delete("programs/" + tmpName)
        try {
          return JSON.parse(result);
        } catch {
          return result;
        }
      });
    })
  }
  
  private replace(s: string, data: any): string {
    const re = new RegExp("{root}", "g");
    s = s.replace(re, this.fileSystem.getRoot());
    Lodash.each(data, (value, key) => {
      const re = new RegExp("{" + key + "}", "g");
      s = s.replace(re, value);
    });
    return s;
  }
}
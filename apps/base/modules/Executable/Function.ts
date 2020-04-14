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
    private shell: ShellCommunicator
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
    return this.shell.exec(this.file, this.command, this.args, data)
  }
}
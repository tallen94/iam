import { ShellCommunicator } from "../Communicator/ShellCommunicator";
import { FileSystem } from "../FileSystem/FileSystem";
import * as Lodash from "lodash";

export class Droplet {

  private process: any;

  constructor(
    private shellCommunicator: ShellCommunicator,
    private program: any,
    private fileSystem: FileSystem
  ) {

  }

  public activate(data: any) {
    const path = this.fileSystem.path("programs/" + this.program.name);
    let run = this.program.command + " " + path;
    if (this.program.args != "") {
      const args = this.replace(this.program.args, data);
      run = run + " " + args;
    }
    this.process = this.shellCommunicator.createProcess(run)
  }

  public pipe(data: any): Promise<any> {
    this.shellCommunicator.pipeProcess(this.process.pid, data)
    return this.process.promise
  }

  public clone() {
    return new Droplet(this.shellCommunicator, this.program, this.fileSystem);
  }

  public expire() {
    return this.pipe({}).then();
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
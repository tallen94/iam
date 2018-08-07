import * as Shell from "shelljs";

import {
  Node
} from "../modules";

export class ShellCommunicator {

  constructor() { }

  public scp(source: string, destination: string, user: string, host: string, options: string[]): Promise<string> {
    return this.exec("scp " + options.join(" ") + " " + source + " " + user + "@" + host + ":" + destination);
  }

  public sshCmd(user: string, host: string, command: string): Promise<string> {
    return this.exec("ssh " + user + "@" + host + " '" + command + "'");
  }

  public exec(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      Shell.exec(command, (code: number, out: string, err: any) => {
        resolve(out);
      });
    });
  }
}
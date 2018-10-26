import Shell from "shelljs";

export class ShellCommunicator {

  constructor() { }

  public scp(source: string, destination: string, user: string, host: string, options: string[]): Promise<string> {
    return this.exec("scp " + options.join(" ") + " " + source + " " + user + "@" + host + ":" + destination);
  }

  public sshCmd(user: string, host: string, command: string): Promise<string> {
    return this.exec("ssh " + user + "@" + host + " '" + command + "'");
  }

  public exec(command: string): Promise<string> {
    console.log(command);
    return new Promise((resolve, reject) => {
      Shell.exec(command, { silent: false }, (code: number, out: string, err: any) => {
        resolve(out);
      });
    });
  }
}
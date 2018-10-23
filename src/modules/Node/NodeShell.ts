import * as Lodash from "lodash";
import { ShellCommunicator } from "../Communicator/ShellCommunicator";

export class NodeShell {
  private shellCommunicator: ShellCommunicator;

  constructor(shellCommunicator: ShellCommunicator) {
    this.shellCommunicator = shellCommunicator;
  }

  public sshExecute(command: string, user: string, host: string): Promise<string> {
    return this.shellCommunicator.exec("ssh " + user + "@" + host + " '" + command + "'");
  }

  public sshNpmInstall(path: string, user: string, host: string): Promise<string> {
    return this.sshExecute("sudo npm i -g " + path, user, host);
  }

  public sshCp(source: string, destination: string, user: string,
    host: string, options: string[]): Promise<string> {
    return this.shellCommunicator.scp(source, destination, user, host, options);
  }

  public sshStartProgram(name: string, user: string, host: string) {
    return this.sshExecute("sudo systemctl start " + name, user, host);
  }

  public sshRestartSystemDaemon(user: string, host: string) {
    return this.sshExecute("sudo systemctl daemon-reload", user, host);
  }

  public command(command: string, args?: string[]): Promise<string> {
    if (args == undefined) {
      return this.shellCommunicator.exec(command);
    }

    return this.shellCommunicator.exec(this.replaceArgs(command, args));
  }

  public npmInstall(path: string): Promise<string> {
    return this.shellCommunicator.exec("sudo npm i -g " + path);
  }

  public startProgram(name: string) {
    return this.shellCommunicator.exec("sudo systemctl start " + name);
  }

  public restartProgram(name: string) {
    return this.shellCommunicator.exec("sudo systemctl restart " + name);
  }

  private replaceArgs(command: string, args: string[]) {
    Lodash.each(args, (arg, index) => {
      command = command.replace("{" + index + "}", arg);
    });
    return command;
  }
}
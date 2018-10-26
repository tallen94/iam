import * as Lodash from "lodash";
import { ShellCommunicator } from "../Communicator/ShellCommunicator";

export class NodeShell {
  private shellCommunicator: ShellCommunicator;

  constructor(shellCommunicator: ShellCommunicator) {
    this.shellCommunicator = shellCommunicator;
  }

  public exec(command: string, args?: string[]): Promise<string> {
    if (args == undefined) {
      return this.shellCommunicator.exec(command);
    }
    const commandReplaced = this.replaceArgs(command, args);
    return this.shellCommunicator.exec(commandReplaced);
  }

  private replaceArgs(command: string, args: string[]) {
    Lodash.each(args, (arg, index) => {
      command = command.replace("{" + index + "}", arg);
    });
    return command;
  }
}
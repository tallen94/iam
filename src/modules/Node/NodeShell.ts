import * as Lodash from "lodash";
import { Node, ShellCommunicator } from "../modules";

export class NodeShell implements Node {
  private status: string;
  private shell: ShellCommunicator;
  private commands: any;
  private programs: any;

  constructor(
    shellCommunicator: ShellCommunicator
  ) {
    this.status = "OK";
    this.shell = shellCommunicator;
    this.commands = {};
    this.programs = {};
  }

  public getStatus(): Promise<string> {
    return Promise.resolve(this.status);
  }

  public update(pkg: any): Promise<any> {
    return this.runCommand("node-update", []);
  }

  public addProgram(name: string, command: string, path: string, program: any): Promise<any> {
    this.programs[name] = {
      programName: name,
      command: command,
      path: path,
      program: program
    };
    return Promise.resolve(this.programs[name]);
  }

  public runProgram(name: string, args: string[]): Promise<any> {
    const program = this.programs[name];
    const runString = program.command + " " + program.path + " " + args.join(" ");
    return this.shell.exec(runString);
  }

  public addCommand(name: string, command: string): Promise<any> {
    this.commands[name] = command;
    return Promise.resolve(this.commands[name]);
  }

  public runCommand(name: string, args: string[]): Promise<any> {
    const command = this.commands[name];
    if (args == undefined) {
      return this.shell.exec(command);
    }
    const commandReplaced = this.replaceArgs(command, args);
    return this.shell.exec(commandReplaced);
  }

  private replaceArgs(command: string, args: string[]) {
    Lodash.each(args, (arg, index) => {
      command = command.replace("{" + index + "}", arg);
    });
    return command;
  }
}
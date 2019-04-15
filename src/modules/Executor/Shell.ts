import * as Lodash from "lodash";
import { ShellCommunicator } from "../modules";

export class Shell {
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

  public update(): Promise<any> {
    return this.runCommand("node-update", []);
  }

  public addProgram(name: string, exe: string, filename: string, root: string, run: string): Promise<any> {
    this.programs[name] = {
      name: name,
      exe: exe,
      root: root,
      filename: filename
    };
    this.programs[name]["run"] = this.replace(run, this.programs[name]);
    return Promise.resolve(this.programs[name]);
  }

  public runProgram(name: string, data: any): Promise<any> {
    const program = this.programs[name];
    return this.shell.exec(program.run, JSON.stringify(data))
    .then((result: any) => {
      return JSON.parse(result);
    });
  }

  public addCommand(name: string, command: string): Promise<any> {
    this.commands[name] = command;
    return Promise.resolve(this.commands[name]);
  }

  public runCommand(name: string, data: any): Promise<any> {
    const command = this.commands[name];
    if (data == undefined) {
      return this.shell.exec(command);
    }
    const commandReplaced = this.replace(command, data);
    return this.shell.exec(commandReplaced);
  }

  private replace(s: string, data: any): string {
    Lodash.each(data, (value, key) => {
      s = s.replace("{" + key + "}", value);
    });
    return s;
  }
}
import * as Lodash from "lodash";
import * as FS from "fs";
import { ShellCommunicator } from "../modules";
import { Database } from "./Database";
import { FileSystem } from "../FileSystem/FileSystem";

export class Shell {
  private status: string;
  private shell: ShellCommunicator;
  private commands: any;
  private programs: any;
  private database: Database;
  private fileSystem: FileSystem;

  constructor(
    shellCommunicator: ShellCommunicator,
    database: Database,
    fileSystem: FileSystem
  ) {
    this.status = "OK";
    this.shell = shellCommunicator;
    this.database = database;
    this.commands = {};
    this.programs = {};
    this.fileSystem = fileSystem;
  }

  public loadData() {
    return Promise.all([
      this.getCommands(),
      this.getPrograms()
    ]);
  }

  public getStatus(): Promise<string> {
    return Promise.resolve(this.status);
  }

  public update(): Promise<any> {
    return this.runCommand("node-update", []);
  }

  public addProgram(name: string, data: string): Promise<any> {
    data = JSON.parse(data);
    return this.getProgram(name)
    .then((result) => {
      if (result == undefined) {
        return this.database.runQuery("add-exe", {
          name: name,
          type: "PROGRAM",
          data: escape(JSON.stringify(data))
        });
      } else {
        return this.database.runQuery("update-exe", {
          name: name,
          type: "PROGRAM",
          data: escape(JSON.stringify(data))
        });
      }
    }).then((result) => {
      this.programs[name] = data;
      return this.programs[name];
    });
  }

  public getProgram(name: string) {
    return this.database.runQuery("get-exe-by-type-name", {name: name, type: "PROGRAM"})
    .then((result) => {
      if (result.length > 0) {
        const data = unescape(result[0].data);
        this.programs[name] = JSON.parse(data);
        const filePath = this.fileSystem.programPath(this.programs[name].filename);
        return { program: FS.readFileSync(filePath).toString(), data: this.programs[name] };
      }
      return undefined;
    });
  }

  public getPrograms() {
    return this.database.runQuery("get-exe-by-type", {type: "PROGRAM"})
    .then((data) => {
      return Lodash.map(data, (item) => {
        const data = unescape(item.data);
        this.programs[item.name] = JSON.parse(data);
        return {name: item.name};
      });
    });
  }

  public runProgram(name: string, data: any): Promise<any> {
    const program = this.programs[name];
    program.root = this.fileSystem.getProgramRoot();
    const run = this.replace(program.run, program);
    return this.shell.exec(run, JSON.stringify(data))
    .then((result: any) => {
      return JSON.parse(result);
    });
  }

  public addCommand(name: string, command: string): Promise<any> {
    this.commands[name] = command;
    return this.getCommand(name)
    .then((result) => {
      if (result == undefined) {
        return this.database.runQuery("add-exe", {
          name: name,
          type: "COMMAND",
          data: escape(this.commands[name])
        });
      } else {
        return this.database.runQuery("update-exe", {
          name: name,
          type: "COMMAND",
          data: escape(this.commands[name])
        });
      }
    }).then((result) => {
      this.commands[name] = command;
      return this.commands[name];
    });
  }

  public getCommand(name: string) {
    return this.database.runQuery("get-exe-by-type-name", {name: name, type: "COMMAND"})
    .then((result) => {
      if (result.length > 0) {
        this.commands[name] = unescape(result[0]["data"]);
        return { command: this.commands[name] };
      }
      return undefined;
    });
  }

  public getCommands() {
    return this.database.runQuery("get-exe-by-type", {type: "COMMAND"})
    .then((data) => {
      return Lodash.map(data, (item) => {
        this.commands[item.name] = unescape(item["data"]);
        return {name: item.name};
      });
    });
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
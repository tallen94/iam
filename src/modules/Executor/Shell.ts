import * as Lodash from "lodash";
import * as FS from "fs";
import * as UUID from "uuid";
import { ShellCommunicator } from "../modules";
import { Database } from "./Database";
import { FileSystem } from "../FileSystem/FileSystem";
import { LocalProcess } from "../Process/LocalProcess";
import { Process } from "../Process/Process";
import { FileSystemCommunicator } from "../Communicator/FileSystemCommunicator";

export class Shell {
  private status: string;
  private shell: ShellCommunicator;
  private fileSystemCommunicator: FileSystemCommunicator;
  private database: Database;
  private fileSystem: FileSystem;

  constructor(
    shellCommunicator: ShellCommunicator,
    fileSystemCommunicator: FileSystemCommunicator,
    database: Database,
    fileSystem: FileSystem
  ) {
    this.status = "OK";
    this.shell = shellCommunicator;
    this.fileSystemCommunicator = fileSystemCommunicator;
    this.database = database;
    this.fileSystem = fileSystem;
  }

  public getStatus(): Promise<string> {
    return Promise.resolve(this.status);
  }

  public update(): Promise<any> {
    return this.runCommand("node-update", []);
  }

  public addProgram(name: string, data: string, dataType: string, dataModel: string, userId: number, description: string): Promise<any> {
    const parsedData = JSON.parse(data);
    const filteredData = JSON.stringify({
      exe: parsedData.exe,
      args: parsedData.args
    });
    return this.getProgram(name)
    .then((result) => {
      if (result == undefined) {
        return this.database.runQuery("add-exe", {
          name: name,
          type: "PROGRAM",
          data: filteredData,
          dataType: dataType,
          dataModel: dataModel,
          userId: userId,
          description: description
        });
      } else {
        return this.database.runQuery("update-exe", {
          name: name,
          type: "PROGRAM",
          data: filteredData,
          dataType: dataType,
          dataModel: dataModel,
          userId: userId,
          description: description
        });
      }
    }).then(() => {
      return this.fileSystemCommunicator.putProgram({
        name: name,
        program: parsedData.program
      });
    });
  }

  public getProgram(name: string) {
    return this.database.runQuery("get-exe-by-type-name", {name: name, type: "PROGRAM"})
    .then((result) => {
      if (result.length > 0) {
        const item = result[0];
        const data = JSON.parse(item.data);
        return this.fileSystemCommunicator.getProgram(data.filename == undefined ? name : data.filename)
        .then((result) => {
          return {
            name: item.name,
            data: data,
            dataType: item.dataType,
            dataModel: item.dataModel,
            program: result,
            description: item.description
          };
        });
      }
      return undefined;
    });
  }

  public getPrograms(userId: number) {
    return this.database.runQuery("get-exe-for-user", {type: "PROGRAM", userId: userId})
    .then((data) => {
      return Promise.all(Lodash.map(data, (item) => {
        return this.database.runQuery("search-steplists", {query: "%name\":\"" + item.name + "\"%"})
        .then((results) => {
          return {
            name: item.name,
            description: item.description,
            steplists: results
          };
        });
      }));
    });
  }

  public getProcess(name: string) {
    // const program = this.programs[name];
    // program.root = this.fileSystem.getProgramRoot();
    // return this.replace(program.run, program);
    return null;
  }

  public spawn(name: string): Process {
    const p = this.getProcess(name);
    const split = p.split(" ");
    const process: Process = new LocalProcess(split[0], [split[1]]);
    return process;
  }

  public runProgram(name: string, data: any): Promise<any> {
    return this.getProgram(name)
    .then((program) => {
      let run = "";
      const path = this.fileSystem.getProgramRoot() + "/" + UUID.v4();
      if (!FS.existsSync(path)) {
        const write = FS.createWriteStream(path);
        write.write(program.program);
        write.close();
      }

      run = program.data.exe + " " + path;
      if (program.data.args != "") {
        const args = this.replace(program.data.args, data);
        run = run + " " + args;
      }
      return this.shell.exec(run, JSON.stringify(data))
      .then((result: any) => {
        FS.unlinkSync(path);
        try {
          return JSON.parse(result);
        } catch {
          return result;
        }
      });
    });
  }

  public addCommand(name: string, command: string, dataType: string, dataModel: string, userId: number, description: string): Promise<any> {
    return this.getCommand(name)
    .then((result) => {
      if (result == undefined) {
        return this.database.runQuery("add-exe", {
          name: name,
          type: "COMMAND",
          data: command,
          dataType: dataType,
          dataModel: dataModel,
          userId: userId,
          description: description
        });
      } else {
        return this.database.runQuery("update-exe", {
          name: name,
          type: "COMMAND",
          data: command,
          dataType: dataType,
          dataModel: dataModel,
          userId: userId,
          description: description
        });
      }
    });
  }

  public getCommand(name: string) {
    return this.database.runQuery("get-exe-by-type-name", {name: name, type: "COMMAND"})
    .then((result) => {
      if (result.length > 0) {
        const item = result[0];
        return {
          command: item.data,
          dataType: item.dataType,
          dataModel: item.dataModel,
          description: item.description
        };
      }
      return undefined;
    });
  }

  public getCommands(userId: number) {
    return this.database.runQuery("get-exe-for-user", {type: "COMMAND", userId: userId})
    .then((data) => {
      return Promise.all(Lodash.map(data, (item) => {
        return this.database.runQuery("search-steplists", {query: "%name\":\"" + item.name + "\"%"})
        .then((results) => {
          return {
            name: item.name,
            description: item.description,
            steplists: results
          };
        });
      }));
    });
  }

  public runCommand(name: string, data: any): Promise<any> {
    return this.getCommand(name).then((command) => {
      if (data == undefined) {
        return this.shell.exec(command.command);
      }
      const commandReplaced = this.replace(command.command, data);
      return this.shell.exec(commandReplaced);
    });
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
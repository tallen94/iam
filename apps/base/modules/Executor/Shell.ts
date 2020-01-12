import * as Lodash from "lodash";
import * as FS from "fs";
import * as UUID from "uuid";
import { ShellCommunicator } from "../modules";
import { Database } from "./Database";
import { FileSystem } from "../FileSystem/FileSystem";
import { LocalProcess } from "../Process/LocalProcess";
import { Process } from "../Process/Process";
import { FileSystemCommunicator } from "../Communicator/FileSystemCommunicator";
import uuid = require("uuid");
import { EnvironmentRouter } from "./EnvironmentRouter";

export class Shell {
  private status: string;
  private shell: ShellCommunicator;
  private fileSystemCommunicator: FileSystemCommunicator;
  private database: Database;
  private fileSystem: FileSystem;
  private environmentRouter: EnvironmentRouter;

  constructor(
    shellCommunicator: ShellCommunicator,
    fileSystemCommunicator: FileSystemCommunicator,
    database: Database,
    fileSystem: FileSystem,
    environmentRouter: EnvironmentRouter
  ) {
    this.status = "OK";
    this.shell = shellCommunicator;
    this.fileSystemCommunicator = fileSystemCommunicator;
    this.database = database;
    this.fileSystem = fileSystem;
    this.environmentRouter = environmentRouter;
  }

  public getStatus(): Promise<string> {
    return Promise.resolve(this.status);
  }

  public addProgram(data: any): Promise<any> {
    const programData = JSON.stringify({ command: data.command, args: data.args });
    return this.getProgram(data.username, data.name)
    .then((result) => {
      if (result == undefined) {
        return this.database.runQuery("admin", "add-exe", {
          username: data.username,
          name: data.name,
          uuid: UUID.v4(),
          exe: data.exe,
          data: programData,
          input: data.input,
          output: data.output,
          userId: data.userId,
          description: data.description,
          environment: data.environment
        });
      } else {
        return this.database.runQuery("admin", "update-exe", {
          name: data.name,
          exe: data.exe,
          data: programData,
          input: data.input,
          output: data.output,
          description: data.description,
          environment: data.environment
        });
      }
    }).then(() => {
      return Promise.all([
        this.fileSystemCommunicator.putFile("programs", {
          name: data.name,
          file: data.text
        })
      ])
    })
  }

  public getProgram(username: string, name: string) {
    return this.database.runQuery("admin", "get-exe-by-type-name", {username: username, name: name, exe: "function"})
    .then((result) => {
      if (result.length > 0) {
        const item = result[0];
        const data = JSON.parse(item.data);
        const ret = {
          username: item.username,
          name: item.name,
          exe: item.exe,
          args: data.args,
          command: data.command,
          input: item.input,
          output: item.output,
          description: item.description,
          environment: item.environment
        };
        return this.fileSystemCommunicator.getFile("programs", data.filename == undefined ? name : data.filename)
        .then((result) => {
          ret["text"] = result;
          return ret;
        });
      }
      return Promise.resolve(undefined);
    });
  }

  public getProgramFile(name: string) {
    return this.fileSystemCommunicator.getFile("programs", name);
  }

  public getPrograms(username: string) {
    return this.database.runQuery("admin", "get-exe-for-user", {exe: "function", username: username})
    .then((data) => {
      return Promise.all(Lodash.map(data, (item) => {
        return this.database.runQuery("admin", "search-steplists", {query: "%name\":\"" + item.name + "\"%"})
        .then((results) => {
          return {
            username: item.username,
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

  public runProgram(username: string, name: string, data: any): Promise<any> {
    return this.getProgram(username, name)
    .then((program) => {
      let run = "";
      const path = this.fileSystem.writeFolder("programs", uuid.v4(), program.text).toString();
      run = program.command + " " + path;
      if (program.args != "") {
        const args = this.replace(program.args, data);
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
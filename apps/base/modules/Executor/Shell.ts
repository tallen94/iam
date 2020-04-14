import * as uuid from "uuid";
import { ShellCommunicator } from "../modules";
import { LocalProcess } from "../Process/LocalProcess";
import { Process } from "../Process/Process";
import { FileSystemCommunicator } from "../Communicator/FileSystemCommunicator";
import { DatabaseCommunicator } from "../Communicator/DatabaseCommunicator";
import { Queries } from "../Constants/Queries";

export class Shell {

  constructor(
    private shellCommunicator: ShellCommunicator,
    private fileSystemCommunicator: FileSystemCommunicator,
    private databaseCommunicator: DatabaseCommunicator
  ) {
  }

  public addProgram(data: any): Promise<any> {
    const programData = JSON.stringify({ command: data.command, args: data.args });
    return this.getProgram(data.username, data.name)
    .then((result) => {
      if (result == undefined) {
        return this.databaseCommunicator.execute(Queries.ADD_EXECUTABLE, {
          username: data.username, 
          name: data.name,
          uuid: uuid.v4(),
          exe: data.exe,
          data: programData,
          input: data.input,
          output: data.output,
          description: data.description,
          environment: data.environment,
          visibility: data.visibility
        })
      }
      return this.databaseCommunicator.execute(Queries.UPDATE_EXECUTABLE, { 
        name: data.name,
        exe: data.exe,
        data: programData,
        input: data.input,
        output: data.output,
        description: data.description,
        environment: data.environment,
        visibility: data.visibility
      })
    }).then(() => {
      return Promise.all([
        this.fileSystemCommunicator.putFile(data.username + "/programs", {
          name: data.name,
          file: data.text
        })
      ])
    })
  }

  public getProgram(username: string, name: string) {
    return this.databaseCommunicator.execute(Queries.GET_EXE_BY_TYPE_NAME, { username: username, name: name, exe: "function" })
    .then((result: any[]) => {
      if (result.length > 0) {
        const item = result[0];
        const data = JSON.parse(item.data);
        const ret = {
          username: item.username,
          name: item.name,
          exe: item.exe,
          description: item.description,
          input: item.input,
          output: item.output,
          args: data.args,
          command: data.command,
          environment: item.environment,
          visibility: item.visibility
        };
        return this.fileSystemCommunicator.getFile(username + "/programs", name)
        .then((file) => {
          ret["text"] = file
          return ret
        })
      }
      return Promise.resolve(undefined);
    });
  }

  public deleteProgram(username: string, name: string) {
    return this.databaseCommunicator.execute(Queries.DELETE_EXECUTABLE, {username: username, name: name, exe: "function"})
    .then((result) => {
      return this.fileSystemCommunicator.deleteFile(username + "/programs", name)
    })
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

  public getShellCommunicator() {
    return this.shellCommunicator;
  }
}
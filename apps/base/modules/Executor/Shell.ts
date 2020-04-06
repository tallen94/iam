import * as uuid from "uuid";
import { ShellCommunicator } from "../modules";
import { LocalProcess } from "../Process/LocalProcess";
import { Process } from "../Process/Process";
import { FileSystemCommunicator } from "../Communicator/FileSystemCommunicator";
import { ExecutableFactory } from "../Executable/ExecutableFactory";
import { Query } from "../Executable/Query";

export class Shell {
  private status: string;

  constructor(
    private shellCommunicator: ShellCommunicator,
    private fileSystemCommunicator: FileSystemCommunicator,
    private executableFactory: ExecutableFactory
  ) {
    this.status = "OK";
    this.fileSystemCommunicator = fileSystemCommunicator;
  }

  public getStatus(): Promise<string> {
    return Promise.resolve(this.status);
  }

  public addProgram(data: any): Promise<any> {
    const programData = JSON.stringify({ command: data.command, args: data.args });
    return this.getProgram(data.username, data.name)
    .then((result) => {
      if (result == undefined) {
        return this.executableFactory.query({
          username: "admin", 
          name: "add-exe"
        }).then((query: Query) => {
          return query.run({
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
        })
      }
      return this.executableFactory.query({
        username: "admin", 
        name: "update-exe"
      }).then((query: Query) => {
        return query.run({ 
          name: data.name,
          exe: data.exe,
          data: programData,
          input: data.input,
          output: data.output,
          description: data.description,
          environment: data.environment,
          visibility: data.visibility
        })
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
    return this.executableFactory.query({
      username: "admin", 
      name: "get-exe-by-type-name"
    }).then((query: Query) => {
      return query.run({ username: username, name: name, exe: "function" })
    }).then((result) => {
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
        
      }
      return Promise.resolve(undefined);
    });
  }

  public getProgramFile(username: string, name: string) {
    return this.fileSystemCommunicator.getFile(username + "/programs", name);
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
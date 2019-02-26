import {
  ClientCommunicator
} from "../modules";
import { stringify } from "querystring";

export class NodeClient {
  private clientCommunicator: ClientCommunicator;

  constructor(clientCommunicator: ClientCommunicator) {
    this.clientCommunicator = clientCommunicator;
  }

  public getHost(): string {
    return this.clientCommunicator.getHost();
  }

  public getStatus(id?: number): Promise<any> {
    return this.clientCommunicator.post("status", { id: id });
  }

  public getJob(jobId: string, id?: number): Promise<any> {
    return this.clientCommunicator.post("job", {jobId: jobId, id: id });
  }

  public update(file: any, id?: number): Promise<any> {
    return this.clientCommunicator.post("update", { file: file, thread: id });
  }

  public addCommand(name: string, command: string, id?: number) {
    const data = { commandName: name, command: command, id: id };
    return this.clientCommunicator.post("addCommand", data);
  }

  public runCommand(commandName: string, args: string[], threads: number): Promise<any> {
    const data = {
      commandName: commandName,
      args: args,
      threads: threads
    };
    return this.clientCommunicator.post("runCommand", data);
  }

  public runCommands(commandName: string, argsList: string[][]): Promise<any> {
    const data = {
      commandName: commandName,
      argsList: argsList
    };
    return this.clientCommunicator.post("runCommands", data);
  }

  public addProgram(name: string, command: string, filename: string, program: any, id?: number) {
    const data = {
      programName: name,
      command: command,
      filename: filename,
      program: program,
      id: id
    };
    return this.clientCommunicator.post("addProgram", data);
  }

  public runProgram(name: string, args: string[], threads: number): Promise<any> {
    const data = {
      programName: name,
      args: args,
      threads: threads
    };
    return this.clientCommunicator.post("runProgram", data);
  }

  public runPrograms(name: string, argsList: string[][]): Promise<any> {
    const data = {
      programName: name,
      argsList: argsList
    };
    return this.clientCommunicator.post("runPrograms", data);
  }
}
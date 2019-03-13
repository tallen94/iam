import {
  ClientCommunicator,
  Node,
  ApiPaths
} from "../modules";

export class NodeClient implements Node {
  private clientCommunicator: ClientCommunicator;

  constructor(clientCommunicator: ClientCommunicator) {
    this.clientCommunicator = clientCommunicator;
  }

  public getStatus(): Promise<any> {
    return this.clientCommunicator.get(ApiPaths.GET_STATUS);
  }

  public update(file: any): Promise<any> {
    return this.clientCommunicator.post(ApiPaths.UPDATE, { file: file });
  }

  public addProgram(name: string, command: string, filename: string, program: any): Promise<any> {
    const data = {
      programName: name,
      command: command,
      filename: filename,
      program: program
    };
    return this.clientCommunicator.post(ApiPaths.ADD_PROGRAM, data);
  }

  public runProgram(name: string, args: string[]): Promise<any> {
    const data = {
      programName: name,
      args: args
    };
    return this.clientCommunicator.post(ApiPaths.RUN_PROGRAM, data);
  }

  public addCommand(name: string, command: string, id?: number) {
    const data = { commandName: name, command: command, id: id };
    return this.clientCommunicator.post(ApiPaths.ADD_COMMAND, data);
  }

  public runCommand(commandName: string, args: string[]): Promise<any> {
    const data = { commandName: commandName, args: args };
    return this.clientCommunicator.post(ApiPaths.RUN_COMMAND, data);
  }
}
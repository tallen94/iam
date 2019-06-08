import {
  ClientCommunicator,
  ApiPaths
} from "../modules";

export class Client {
  private clientCommunicator: ClientCommunicator;

  constructor(clientCommunicator: ClientCommunicator) {
    this.clientCommunicator = clientCommunicator;
  }

  public spawn(name: string, data: any) {
    return this.clientCommunicator.post(ApiPaths.SPAWN_PROCESS, data, { name: name });
  }

  public runExecutable(type: string, name: string, data: any) {
    return this.clientCommunicator.post(ApiPaths.RUN_EXECUTABLE, data, { type: type, name: name });
  }

  public getHost() {
    return this.clientCommunicator.getHost();
  }

  public getPort() {
    return this.clientCommunicator.getPort();
  }

  public getStatus(): Promise<any> {
    return this.clientCommunicator.get(ApiPaths.GET_STATUS);
  }

  public update(pkg: any): Promise<any> {
    return this.clientCommunicator.postFormData(ApiPaths.UPDATE, { package: pkg });
  }

  public addProgram(name: string, exe: string, filename: string, run: string, program: any, dataType: string, dataModel: any): Promise<any> {
    const formData = {
      exe: exe,
      filename: filename,
      run: run,
      program: program,
      dataType: dataType,
      dataModel: dataModel
    };
    return this.clientCommunicator.postFormData(ApiPaths.ADD_PROGRAM, formData, { name: name });
  }

  public runProgram(name: string, data: any): Promise<any> {
    return this.clientCommunicator.post(ApiPaths.RUN_PROGRAM, data, { name: name });
  }

  public addCommand(name: string, command: string, dataType: string, dataModel: any) {
    const body = { command: command, dataType: dataType, dataModel: dataModel };
    return this.clientCommunicator.post(ApiPaths.ADD_COMMAND, body, { name: name });
  }

  public runCommand(name: string, data: any): Promise<any> {
    return this.clientCommunicator.post(ApiPaths.RUN_COMMAND, data, { name: name });
  }

  public addQuery(name: string, query: string, dataType: string, dataModel: any, userId: number) {
    const body = { query: query, dataType: dataType, dataModel: dataModel, userId: userId };
    return this.clientCommunicator.post(ApiPaths.ADD_QUERY, body, { name: name });
  }

  public runQuery(name: string, data: any) {
    return this.clientCommunicator.post(ApiPaths.RUN_QUERY, data, { name: name });
  }

  public addStepList(name: string, data: string, dataType: string, dataModel: any, userId: number) {
    const body = { data: data, dataType: dataType, dataModel: dataModel, userId: userId };
    return this.clientCommunicator.post(ApiPaths.ADD_STEP_LIST, body, { name: name });
  }

  public runStepList(name: string, data: any) {
    return this.clientCommunicator.post(ApiPaths.RUN_STEP_LIST, data, { name: name });
  }
}
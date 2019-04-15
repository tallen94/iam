import {
  ClientCommunicator,
  ApiPaths
} from "../modules";

export class Client {
  private clientCommunicator: ClientCommunicator;

  constructor(clientCommunicator: ClientCommunicator) {
    this.clientCommunicator = clientCommunicator;
  }

  public getHost() {
    return this.clientCommunicator.getHost();
  }

  public getStatus(): Promise<any> {
    return this.clientCommunicator.get(ApiPaths.GET_STATUS);
  }

  public update(pkg: any): Promise<any> {
    return this.clientCommunicator.postFormData(ApiPaths.UPDATE, { package: pkg });
  }

  public addProgram(name: string, exe: string, filename: string, run: string, program: any): Promise<any> {
    const formData = {
      exe: exe,
      filename: filename,
      run: run,
      program: program
    };
    return this.clientCommunicator.postFormData(ApiPaths.ADD_PROGRAM, formData, { name: name });
  }

  public runProgram(name: string, data: any): Promise<any> {
    return this.clientCommunicator.post(ApiPaths.RUN_PROGRAM, data, { name: name });
  }

  public addCommand(name: string, command: string) {
    const body = { command: command };
    return this.clientCommunicator.post(ApiPaths.ADD_COMMAND, body, { name: name });
  }

  public runCommand(name: string, data: any): Promise<any> {
    return this.clientCommunicator.post(ApiPaths.RUN_COMMAND, data, { name: name });
  }

  public addQuery(name: string, query: string) {
    const body = { query: query };
    return this.clientCommunicator.post(ApiPaths.ADD_QUERY, body, { name: name });
  }

  public runQuery(name: string, data: any) {
    return this.clientCommunicator.post(ApiPaths.RUN_QUERY, data, { name: name });
  }

  public addSyncStepList(name: string, steps: any[]) {
    const body = { steps: steps };
    return this.clientCommunicator.post(ApiPaths.ADD_SYNC_STEP_LIST, body, { name: name });
  }

  public addAsyncStepList(name: string, steps: any[]) {
    const body = { steps: steps };
    return this.clientCommunicator.post(ApiPaths.ADD_ASYNC_STEP_LIST, body, { name: name });
  }

  public runStepList(name: string, data: any) {
    return this.clientCommunicator.post(ApiPaths.RUN_STEP_LIST, data, { name: name });
  }
}
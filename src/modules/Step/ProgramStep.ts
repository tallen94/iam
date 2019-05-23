import { Step } from "./Step";
import { Shell } from "../Executor/Shell";
import { ClientPool } from "../Executor/ClientPool";

export class ProgramStep implements Step {

  private shell: Shell;
  private clientPool: ClientPool;
  private name: string;

  constructor(
    name: string,
    shellExecutor: Shell,
    clientPool: ClientPool) {
      this.shell = shellExecutor;
      this.clientPool = clientPool;
      this.name = name;
  }

  // public spawn() {
  //   return this.clientPool.numClients() > 0 ?
  //   this.clientPool.spawn(this.name, 1) :
  //   [this.shell.spawn(this.name)];
  // }

  public execute(data: any): Promise<any> {
    return this.clientPool.numClients() > 0 ?
    this.clientPool.runExecutable("PROGRAM", this.name, data, 1)
    .then((result) => {
      return result[0].result;
    }) :
    this.shell.runProgram(this.name, data);
  }
}
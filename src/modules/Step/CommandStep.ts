import { Step } from "./Step";
import { Shell } from "../Executor/Shell";
import { ClientPool } from "../Executor/ClientPool";

export class CommandStep implements Step {

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

  public execute(data: any): Promise<any> {
    return this.clientPool.numClients() > 0 ?
    this.clientPool.runCommand(this.name, data, 1).then((result) => {
      return result[0];
    }) :
    this.shell.runCommand(this.name, data);
  }
}
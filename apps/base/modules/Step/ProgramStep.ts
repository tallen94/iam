import { Step } from "./Step";
import { Shell } from "../Executor/Shell";
import { ClientPool } from "../Executor/ClientPool";
import { Client } from "../Executor/Client";

export class ProgramStep implements Step {

  private shell: Shell;
  private clientPool: ClientPool;
  private name: string;
  private username: string;

  constructor(
    username: string,
    name: string,
    shell: Shell,
    clientPool: ClientPool) {
      this.shell = shell;
      this.clientPool = clientPool;
      this.name = name;
      this.username = username;
  }

  // public spawn() {
  //   return this.clientPool.numClients() > 0 ?
  //   this.clientPool.spawn(this.name, 1) :
  //   [this.shell.spawn(this.name)];
  // }

  public execute(data: any, local: boolean): Promise<any> {
    return this.clientPool.runExecutable(this.username, "function", this.name, data, 1)
    .then((result) => {
      return result[0].result;
    });
  }

  public executeEach(data: any) {
    return Promise.all([
      this.clientPool.eachClient((client: Client) => { return client.runExecutable(this.username, "function", this.name, data); }),
      this.shell.runProgram(this.username, this.name, data)
    ]).then((results) => {
      return results[0].concat([results[1]]);
    });
  }
}
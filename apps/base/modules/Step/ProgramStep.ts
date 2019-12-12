import { Step } from "./Step";
import { Shell } from "../Executor/Shell";
import { Client } from "../Executor/Client";

export class ProgramStep implements Step {

  private shell: Shell;
  private name: string;
  private username: string;

  constructor(
    username: string,
    name: string,
    shell: Shell,
    private client: Client) {
      this.shell = shell;
      this.name = name;
      this.username = username;
  }

  // public spawn() {
  //   return this.clientPool.numClients() > 0 ?
  //   this.clientPool.spawn(this.name, 1) :
  //   [this.shell.spawn(this.name)];
  // }

  public execute(data: any): Promise<any> {
    return this.client.runExecutable(this.username, "function", this.name, data)
    .then((result: any) => {
      return result.result;
    });
  }

  // public executeEach(data: any) {
  //   return Promise.all([
  //     this.clientPool.eachClient((client: Client) => { return client.runExecutable(this.username, "function", this.name, data); }),
  //     this.shell.runProgram(this.username, this.name, data)
  //   ]).then((results) => {
  //     return results[0].concat([results[1]]);
  //   });
  // }
}
import { Step } from "./Step";
import { Shell } from "../Executor/Shell";
import { Client } from "../Executor/Client";
import * as Lodash from "lodash";

export class ProgramStep implements Step {

  constructor(
    private username: string,
    private name: string,
    private shell: Shell,
    private client: Client,
    private foreach?: boolean) {}

  // public spawn() {
  //   return this.clientPool.numClients() > 0 ?
  //   this.clientPool.spawn(this.name, 1) :
  //   [this.shell.spawn(this.name)];
  // }

  public execute(data: any): Promise<any> {
    if (this.foreach) {
      const numThreads = 2;
      const threads = [];
      const results = [];

      for (let index = 0; index < data.length; index++) {
        if (threads.length < numThreads) {
          threads.push(Promise.resolve().then(() => {
            return this.client.runExecutable(this.username, "function", this.name, data[index])
            .then((result: any) => {
              results.push(result.result);
            })
          }))
        } else {
          threads[index % numThreads] = threads[index % numThreads]
          .then(() => {
            return this.client.runExecutable(this.username, "function", this.name, data[index])
            .then((result: any) => {
              results.push(result.result);
            })
          })
        }
      }
      return Promise.all(threads).then(() => {
        return results;
      })
    }
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
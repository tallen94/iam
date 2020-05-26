import { Step } from "./Step";
import { Shell } from "../Executor/Shell";
import { Client } from "../Client/Client";

export class ProgramStep implements Step {

  constructor(
    private username: string,
    private cluster: string,
    private environment: string,
    private name: string,
    private client: Client,
    private exe: string,
    private foreach: boolean) {}

  public execute(data: any, token: string): Promise<any> {
    if (this.foreach) {
      const numThreads = 2;
      const threads = [];
      const results = [];

      for (let index = 0; index < data.length; index++) {
        if (threads.length < numThreads) {
          threads.push(Promise.resolve().then(() => {
            return this.client.runExecutable(this.username, this.cluster, this.environment, this.exe, this.name, data[index], token)
            .then((result: any) => {
              results.push(result.result);
            })
          }))
        } else {
          threads[index % numThreads] = threads[index % numThreads]
          .then(() => {
            return this.client.runExecutable(this.username, this.cluster, this.environment, this.exe, this.name, data[index], token)
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
    return this.client.runExecutable(this.username, this.cluster, this.environment, this.exe, this.name, data, token)
    .then((result: any) => {
      return result.result;
    });
  }
}
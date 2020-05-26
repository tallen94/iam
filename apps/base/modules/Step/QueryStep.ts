import { Step } from "./Step";
import { Database } from "../Executor/Database";
import { Client } from "../Client/Client";

export class QueryStep implements Step {

  constructor(
    private username: string,
    private cluster: string,
    private environment: string,
    private name: string,
    private client: Client,
    private foreach?: boolean) { }

  public execute(data: any, token: string): Promise<any> {
    if (this.foreach) {
      const numThreads = 2;
      const threads = [];
      const results = [];

      for (let index = 0; index < data.length; index++) {
        if (threads.length < numThreads) {
          threads.push(Promise.resolve().then(() => {
            return this.client.runExecutable(this.username, this.cluster, this.environment, "query", this.name, data[index], token)
            .then((result: any) => {
              results.push(result.result);
            })
          }))
        } else {
          threads[index % numThreads] = threads[index % numThreads]
          .then(() => {
            return this.client.runExecutable(this.username, this.cluster, this.environment, "query", this.name, data[index], token)
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
    return this.client.runExecutable(this.username, this.cluster, this.environment, "query", this.name, data, token)
    .then((result: any) => {
      return result.result;
    });
  }
}
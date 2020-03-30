import { Step } from "./Step";
import { Database } from "../Executor/Database";
import { Client } from "../Executor/Client";

export class QueryStep implements Step {

  constructor(
    private username: string,
    private name: string,
    private database: Database,
    private client: Client,
    private foreach?: boolean) { }

  public execute(data: any): Promise<any> {
    if (this.foreach) {
      const numThreads = 2;
      const threads = [];
      const results = [];

      for (let index = 0; index < data.length; index++) {
        if (threads.length < numThreads) {
          threads.push(Promise.resolve().then(() => {
            return this.client.runExecutable(this.username, "query", this.name, data[index], "")
            .then((result: any) => {
              results.push(result.result);
            })
          }))
        } else {
          threads[index % numThreads] = threads[index % numThreads]
          .then(() => {
            return this.client.runExecutable(this.username, "query", this.name, data[index], "")
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
    return this.client.runExecutable(this.username, "query", this.name, data, "")
    .then((result: any) => {
      return result.result;
    });
  }
}
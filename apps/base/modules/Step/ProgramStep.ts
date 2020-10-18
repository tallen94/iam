import { Step } from "./Step";
import { Client } from "../Client/Client";
import { AuthData } from "../Auth/AuthData";

export class ProgramStep implements Step {

  constructor(
    private executable,
    private client: Client,
    private foreach: boolean) {}

  public execute(data: any, authData: AuthData): Promise<any> {
    if (this.foreach) {
      const numThreads = 3;
      const threads = [];
      const results = [];

      for (let index = 0; index < data.length; index++) {
        if (threads.length < numThreads) {
          threads.push(Promise.resolve().then(() => {
            return this.client.runExecutable(this.executable.username, this.executable.cluster, this.executable.environment, this.executable.exe, this.executable.name, data[index], authData)
            .then((result: any) => {
              results.push(result.result);
            })
          }))
        } else {
          threads[index % numThreads] = threads[index % numThreads]
          .then(() => {
            return this.client.runExecutable(this.executable.username, this.executable.cluster, this.executable.environment, this.executable.exe, this.executable.name, data[index], authData)
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
    return this.client.runExecutable(this.executable.username, this.executable.cluster, this.executable.environment, this.executable.exe, this.executable.name, data, authData)
    .then((result: any) => {
      return result.result;
    });
  }
}
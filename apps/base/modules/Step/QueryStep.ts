import { Step } from "./Step";
import { Database } from "../Executor/Database";
import { Client } from "../Executor/Client";

export class QueryStep implements Step {

  private database: Database;
  private name: string;
  private username: string;

  constructor(
    username: string,
    name: string,
    databaseExecutor: Database,
    private client: Client) {
      this.database = databaseExecutor;
      this.name = name;
      this.username = username;
  }

  // public spawn() {
  //   return this.clientPool.numClients() > 0 ?
  //   this.clientPool.spawn(this.name, 1)[0] :
  //   this.database.spawn(this.name);
  // }

  public execute(data: any): Promise<any> {
    return this.client.runExecutable(this.username, "query", this.name, data)
    .then((result: any) => {
      return result.result;
    });
  }

  // public executeEach(data: any) {
  //   return Promise.all([
  //     this.clientPool.eachClient((client: Client) => { return client.runExecutable(this.username, "query", this.name, data); }),
  //     this.database.runQuery(this.username, this.name, data)
  //   ]).then((results) => {
  //     return results[0].concat([results[1]]);
  //   });
  // }
}
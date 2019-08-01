import { Step } from "./Step";
import { ClientPool } from "../Executor/ClientPool";
import { Database } from "../Executor/Database";
import { Client } from "../Executor/Client";

export class QueryStep implements Step {

  private database: Database;
  private clientPool: ClientPool;
  private name: string;

  constructor(
    name: string,
    databaseExecutor: Database,
    clientPool: ClientPool) {
      this.database = databaseExecutor;
      this.clientPool = clientPool;
      this.name = name;
  }

  public spawn() {
    return this.clientPool.numClients() > 0 ?
    this.clientPool.spawn(this.name, 1)[0] :
    this.database.spawn(this.name);
  }

  public execute(data: any): Promise<any> {
    return this.clientPool.numClients() > 0 ?
    this.clientPool.runExecutable("QUERY", this.name, data, 1)
    .then((result) => {
      return result[0].result;
    }) :
    this.database.runQuery(this.name, data);
  }

  public executeEach(data: any) {
    return Promise.all([
      this.clientPool.eachClient((client: Client) => { return client.runExecutable("QUERY", this.name, data); }),
      this.database.runQuery(this.name, data)
    ]).then((results) => {
      return results[0].concat([results[1]]);
    });
  }
}
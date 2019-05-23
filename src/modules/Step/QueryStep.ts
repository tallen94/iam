import { Step } from "./Step";
import { ClientPool } from "../Executor/ClientPool";
import { Database } from "../Executor/Database";

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
}
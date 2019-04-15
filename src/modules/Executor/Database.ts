import * as Lodash from "lodash";
import {
  DatabaseCommunicator
} from "../modules";

export class Database {
  private status: string;
  private databaseCommunicator: DatabaseCommunicator;
  private queries: any;

  constructor(databaseCommunicator: DatabaseCommunicator) {
    this.databaseCommunicator = databaseCommunicator;
    this.status = "OK";
    this.queries = {};
  }

  public getStatus(): Promise<any> {
    return Promise.resolve(this.status);
  }

  public addQuery(name: string, query: string): Promise<any> {
    this.queries[name] = query;
    return Promise.resolve(this.queries[name]);
  }

  public runQuery(name: string, data: any): Promise<any> {
    const query = this.queries[name];
    const queryReplaced = this.replace(query, data);
    return this.databaseCommunicator.execute(queryReplaced);
  }

  private replace(s: string, data: any): string {
    Lodash.each(data, (value, key) => {
      s = s.replace("{" + key + "}", value);
    });
    return s;
  }
}
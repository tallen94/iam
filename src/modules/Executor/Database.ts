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

  public loadData() {
    return this.getQueries();
  }

  public getStatus(): Promise<any> {
    return Promise.resolve(this.status);
  }

  public addQuery(name: string, query: string): Promise<any> {
    return this.getQuery(name)
    .then((result) => {
      if (result == undefined) {
        return this.runQuery("add-exe", {
          name: name,
          type: "QUERY",
          data: escape(query)
        });
      } else {
        return this.runQuery("update-exe", {
          name: name,
          type: "QUERY",
          data: escape(query)
        });
      }
    }).then((result) => {
      this.queries[name] = query;
      return this.queries[name];
    });
  }

  public getQuery(name: string) {
    return this.runQuery("get-exe-by-type-name", {name: name, type: "QUERY"})
    .then((result) => {
      if (result.length > 0) {
        this.queries[name] = unescape(result[0]["data"]);
        return { query: this.queries[name] };
      }
      return undefined;
    });
  }

  public getQueries() {
    const queryStr = this.replace("SELECT * FROM executable WHERE type='{type}';", {type: "QUERY"});
    return this.execute(queryStr)
    .then((data) => {
      return Lodash.map(data, (item) => {
        this.queries[item.name] = unescape(item.data);
        return {name: item.name};
      });
    });
  }

  public runQuery(name: string, data: any): Promise<any> {
    const queryString = this.queries[name];
    const queryReplaced = this.replace(queryString, data);
    return this.execute(queryReplaced);
  }

  public execute(query: string): Promise<any> {
    return this.databaseCommunicator.execute(query);
  }

  private replace(s: string, data: any): string {
    Lodash.each(data, (value, key) => {
      s = s.replace(new RegExp("{" + key + "}", "g"), value);
    });
    return s;
  }
}
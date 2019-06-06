import * as Lodash from "lodash";
import {
  DatabaseCommunicator
} from "../modules";
import { QueryProcess } from "../Process/QueryProcess";

export class Database {
  private status: string;
  private databaseCommunicator: DatabaseCommunicator;

  constructor(databaseCommunicator: DatabaseCommunicator) {
    this.databaseCommunicator = databaseCommunicator;
    this.status = "OK";
  }

  public getConnection() {
    return this.databaseCommunicator.getConnection();
  }

  public getStatus(): Promise<any> {
    return Promise.resolve(this.status);
  }

  public addQuery(name: string, query: string, dataType: string, dataModel: string, userId: number): Promise<any> {
    return this.getQuery(name)
    .then((result) => {
      if (result == undefined) {
        return this.runQuery("add-exe", {
          name: name,
          type: "QUERY",
          data: query,
          dataType: dataType,
          dataModel: dataModel,
          userId: userId
        });
      } else {
        return this.runQuery("update-exe", {
          name: name,
          type: "QUERY",
          data: query,
          dataType: dataType,
          dataModel: dataModel,
          userId: userId
        });
      }
    });
  }

  public getQuery(name: string) {
    const queryStr = this.replace("SELECT * FROM executable WHERE name='{name}' AND type='QUERY';", {name: name});
    return this.execute(queryStr)
    .then((result) => {
      if (result.length > 0) {
        const item = result[0];
        return {
          query: unescape(item.data),
          dataType: item.dataType,
          dataModel: unescape(item.dataModel)
        };
      }
      return undefined;
    });
  }

  public getQueries() {
    return this.execute("SELECT * FROM executable WHERE type='QUERY';")
    .then((data) => {
      return Lodash.map(data, (item) => {
        return {name: item.name};
      });
    });
  }

  public getQueryString(name: string) {
    // return this.queries[name].query;
    return null;
  }

  public spawn(name: string): QueryProcess {
    const query = this.getQueryString(name);
    return new QueryProcess(query, this.databaseCommunicator.getConnection());
  }

  public runQuery(name: string, data: any): Promise<any> {
    return this.getQuery(name).then((query) => {
      const queryReplaced = this.replace(query.query, data);
      return this.execute(queryReplaced);
    });
  }

  public execute(query: string): Promise<any> {
    return this.databaseCommunicator.execute(query);
  }

  private replace(s: string, data: any): string {
    Lodash.each(data, (value, key) => {
      s = s.replace(new RegExp("{" + key + "}", "g"), escape(value));
    });
    return s;
  }
}
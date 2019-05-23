import * as Lodash from "lodash";
import {
  DatabaseCommunicator
} from "../modules";
import { QueryProcess } from "../Process/QueryProcess";

export class Database {
  private status: string;
  private databaseCommunicator: DatabaseCommunicator;
  private queries: any;

  constructor(databaseCommunicator: DatabaseCommunicator) {
    this.databaseCommunicator = databaseCommunicator;
    this.status = "OK";
    this.queries = {};
  }

  public getConnection() {
    return this.databaseCommunicator.getConnection();
  }

  public loadData() {
    return this.getQueries();
  }

  public getStatus(): Promise<any> {
    return Promise.resolve(this.status);
  }

  public addQuery(name: string, query: string, dataType: string, dataModel: string): Promise<any> {
    return this.getQuery(name)
    .then((result) => {
      if (result == undefined) {
        return this.runQuery("add-exe", {
          name: name,
          type: "QUERY",
          data: escape(query),
          dataType: dataType,
          dataModel: escape(dataModel)
        });
      } else {
        return this.runQuery("update-exe", {
          name: name,
          type: "QUERY",
          data: escape(query),
          dataType: dataType,
          dataModel: escape(dataModel)
        });
      }
    }).then((result) => {
      this.queries[name] = {
        query: query,
        dataType: dataType,
        dataModel: dataModel
      };
      return this.queries[name];
    });
  }

  public getQuery(name: string) {
    return this.runQuery("get-exe-by-type-name", {name: name, type: "QUERY"})
    .then((result) => {
      if (result.length > 0) {
        const item = result[0];
        this.queries[name] = {
          query: unescape(item.data),
          dataType: item.dataType,
          dataModel: unescape(item.dataModel)
        };
        return this.queries[name];
      }
      return undefined;
    });
  }

  public getQueries() {
    const queryStr = this.replace("SELECT * FROM executable WHERE type='{type}';", {type: "QUERY"});
    return this.execute(queryStr)
    .then((data) => {
      return Lodash.map(data, (item) => {
        this.queries[item.name] = {
          query: unescape(item.data),
          dataType: item.dataType,
          dataModel: unescape(item.dataModel)
        };
        return {name: item.name};
      });
    });
  }

  public getQueryString(name: string) {
    return this.queries[name].query;
  }

  public spawn(name: string): QueryProcess {
    const query = this.getQueryString(name);
    return new QueryProcess(query, this.databaseCommunicator.getConnection());
  }

  public runQuery(name: string, data: any): Promise<any> {
    const queryString = this.queries[name].query;
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
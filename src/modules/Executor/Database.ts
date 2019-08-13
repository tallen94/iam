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

  public addQuery(name: string, query: string, dataType: string, dataModel: string, userId: number, description: string): Promise<any> {
    return this.getQuery(name)
    .then((result) => {
      if (result == undefined) {
        return this.runQuery("add-exe", {
          name: name,
          type: "QUERY",
          data: query,
          dataType: dataType,
          dataModel: dataModel,
          userId: userId,
          description: description
        });
      } else {
        return this.runQuery("update-exe", {
          name: name,
          type: "QUERY",
          data: query,
          dataType: dataType,
          dataModel: dataModel,
          userId: userId,
          description: description
        });
      }
    });
  }

  public getQuery(name: string) {
    const queryStr = "SELECT * FROM executable WHERE name={name} AND type='QUERY';";
    return this.databaseCommunicator.execute(queryStr, {name: name})
    .then((result: any) => {
      if (result.length > 0) {
        const item = result[0];
        return {
          query: item.data,
          dataType: item.dataType,
          dataModel: item.dataModel,
          description: item.description
        };
      }
      return undefined;
    });
  }

  public getQueries(userId: number) {
    const queryStr = "SELECT * FROM executable WHERE type='QUERY' AND userId={userId};";
    return this.databaseCommunicator.execute(queryStr, {userId: userId})
    .then((data: any) => {
      return Promise.all(Lodash.map(data, (item) => {
        return this.runQuery("search-steplists", {query: "%name\":\"" + item.name + "\"%"})
        .then((results) => {
          return {
            name: item.name,
            description: item.description,
            steplists: results
          };
        });
      }));
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
      return this.runQueryString(query.query, data);
    });
  }
  public runQueryString(queryString: string, data: any): Promise<any> {
    return this.databaseCommunicator.execute(queryString, data);
  }
}
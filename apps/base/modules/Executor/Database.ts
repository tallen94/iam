import * as Lodash from "lodash";
import * as UUID from "uuid";
import {
  DatabaseCommunicator
} from "../modules";
import { FileSystemCommunicator } from "../Communicator/FileSystemCommunicator";
import { QueryProcess } from "../Process/QueryProcess";
import { Authorization } from "../Auth/Authorization";

export class Database {
  private status: string;

  constructor(
    private databaseCommunicator: DatabaseCommunicator,
    private fileSystemCommunicator: FileSystemCommunicator,
    private authorization: Authorization) {
    this.status = "OK";
  }

  public getConnection() {
    return this.databaseCommunicator.getConnection();
  }

  public getStatus(): Promise<any> {
    return Promise.resolve(this.status);
  }

  public addQuery(data: any): Promise<any> {
    return this.getQuery(data.username, data.name)
    .then((result) => {
      if (result == undefined) {
        return this.runQuery("admin", "add-exe", {
          username: data.username,
          name: data.name,
          uuid: UUID.v4(),
          exe: data.exe,
          data: "",
          input: data.input,
          output: data.output,
          userId: data.userId,
          description: data.description,
          environment: data.environment,
          visibility: data.visibility
        }, "");
      } else {
        return this.runQuery("admin", "update-exe", {
          name: data.name,
          exe: data.exe,
          data: "",
          input: data.input,
          output: data.output,
          description: data.description,
          environment: data.environment,
          visibility: data.visibility
        }, "");
      }
    }).then(() => {
      return Promise.all([
        this.fileSystemCommunicator.putFile(data.username + "/queries", {
          name: data.name,
          file: data.text
        })
      ])
    });
  }

  public getQueryFile(username: string, name: string) {
    return this.fileSystemCommunicator.getFile(username + "/queries", name);
  }

  public getQuery(username: string, name: string) {
    const queryStr = "SELECT * FROM executable WHERE name={name} AND exe='query' AND username={username};";
    return this.databaseCommunicator.execute(queryStr, {name: name, username: username})
    .then((result: any) => {
      if (result.length > 0) {
        const item = result[0];
        const ret = {
          username: item.username,
          name: item.name,
          exe: item.exe,
          description: item.description,
          input: item.input,
          output: item.output,
          environment: item.environment,
          visibility: item.visibility
        };
        return this.fileSystemCommunicator.getFile(username + "/queries", name)
        .then((result) => {
          ret["text"] = result;
          return ret;
        });
      }
      return Promise.resolve(undefined);
    });
  }

  public getQueries(username: string) {
    const queryStr = "SELECT * FROM executable WHERE exe='query' AND username={username};";
    return this.databaseCommunicator.execute(queryStr, {username: username})
    .then((data: any) => {
      return Promise.all(Lodash.map(data, (item) => {
        return this.runQuery("admin", "search-steplists", {query: "%name\":\"" + item.name + "\"%"}, "")
        .then((results) => {
          return {
            username: item.username,
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

  public runQuery(username: string, name: string, data: any, token: string): Promise<any> {
    return this.getQuery(username, name)
    .then((query) => {
      if (query.visibility == "auth") {
        return this.authorization.validateUserToken(query.username, token, this, () => {
          return query;
        })
      } else if (query.visibility == "private") {
        return this.authorization.validateClusterToken(token, () => {
          return query;
        })
      }
      return query;
    })
    .then((query) => {
      return this.runQueryString(query.text, data);
    });
  }
  public runQueryString(queryString: string, data: any): Promise<any> {
    return this.databaseCommunicator.execute(queryString, data);
  }
}
import * as Lodash from "lodash";
import * as uuid from "uuid";
import {
  DatabaseCommunicator
} from "../modules";
import { FileSystemCommunicator } from "../Communicator/FileSystemCommunicator";
import { QueryProcess } from "../Process/QueryProcess";
import { Query } from "../Executable/Query";
import { ExecutableFactory } from "../Executable/ExecutableFactory";

export class Database {
  private status: string;

  constructor(
    private databaseCommunicator: DatabaseCommunicator,
    private fileSystemCommunicator: FileSystemCommunicator,
    private executableFactory: ExecutableFactory) {
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
        return this.executableFactory.query({
          username: "admin", 
          name: "add-exe"
        }).then((query: Query) => {
          return query.run({
            username: data.username, 
            name: data.name,
            uuid: uuid.v4(),
            exe: data.exe,
            data: "",
            input: data.input,
            output: data.output,
            description: data.description,
            environment: data.environment,
            visibility: data.visibility
          })
        })
      }
      return this.executableFactory.query({
        username: "admin", 
        name: "update-exe"
      }).then((query: Query) => {
        return query.run({ 
          name: data.name,
          exe: data.exe,
          data: "",
          input: data.input,
          output: data.output,
          description: data.description,
          environment: data.environment,
          visibility: data.visibility
        })
      })
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

  public getQueryString(name: string) {
    // return this.queries[name].query;
    return null;
  }

  public spawn(name: string): QueryProcess {
    const query = this.getQueryString(name);
    return new QueryProcess(query, this.databaseCommunicator.getConnection());
  }
}
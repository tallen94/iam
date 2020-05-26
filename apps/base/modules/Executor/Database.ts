import * as uuid from "uuid";
import {
  DatabaseCommunicator
} from "../modules";
import { FileSystemCommunicator } from "../Communicator/FileSystemCommunicator";
import { QueryProcess } from "../Process/QueryProcess";
import { Queries } from "../Constants/Queries";

export class Database {

  constructor(
    private databaseCommunicator: DatabaseCommunicator,
    private fileSystemCommunicator: FileSystemCommunicator) {
  }

  public addQuery(data: any): Promise<any> {
    return this.getQuery(data.username, data.cluster, data.environment, data.name)
    .then((result) => {
      if (result == undefined) {
        return this.databaseCommunicator.execute(Queries.ADD_EXECUTABLE, {
          username: data.username, 
          name: data.name,
          uuid: uuid.v4(),
          exe: data.exe,
          data: "",
          input: data.input,
          output: data.output,
          description: data.description,
          environment: data.environment,
          cluster: data.cluster,
          visibility: data.visibility
        })
      }
      return this.databaseCommunicator.execute(Queries.UPDATE_EXECUTABLE, { 
        username: data.username,
        name: data.name,
        exe: data.exe,
        data: "",
        input: data.input,
        output: data.output,
        description: data.description,
        environment: data.environment,
        cluster: data.cluster,
        visibility: data.visibility
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

  public getQuery(username: string, cluster: string, environment: string, name: string) {
    return this.databaseCommunicator.execute(Queries.GET_EXE, {
      username: username, 
      cluster: cluster, 
      environment: environment, 
      name: name, 
      exe: 'query'
    }).then((result: any) => {
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
          cluster: item.cluster,
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

  public deleteQuery(username: string, cluster: string, environment: string, name: string) {
    return this.databaseCommunicator.execute(Queries.DELETE_EXECUTABLE, {username: username, cluster: cluster, environment: environment, name: name, exe: "query"})
    .then((result) => {
      return this.fileSystemCommunicator.deleteFile(username + "/queries", name)
    })
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
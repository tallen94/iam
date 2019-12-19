import { Database } from "../modules";
import { FileSystemCommunicator } from "../Communicator/FileSystemCommunicator";
import Lodash from "lodash";

export class EnvironmentManager {

  constructor(
    private database: Database,
    private fileSystemCommunicator: FileSystemCommunicator
  ) { }

  public addEnvironment(data: any) {
    return this.getEnvironment(data.username, data.name)
    .then((result) => {
      if (result == undefined) {
        return this.database.runQuery("admin", "add-environment", {
          username: data.username, 
          name: data.name,
          host: data.host,
          port: data.port
        })
      }
      return this.database.runQuery("admin", "update-environment", {
        username: data.username, 
        name: data.name,
        host: data.host,
        port: data.port
      })
    }).then(() => {
      return this.fileSystemCommunicator.putImage({
        username: data.username,
        name: data.name,
        image: data.image
      })
    })
  }

  public getEnvironment(username: string, name: string) {
    return this.database.runQuery("admin", "get-environment", { username: username, name: name })
    .then((result) => {
      if (result.length > 0) {
        const item = result[0];
        const ret = {
          username: item.username,
          name: item.name,
          host: item.host,
          port: item.port
        }
        return this.fileSystemCommunicator.getImage(item.name)
        .then((result) => {
          ret["image"] = result;
          return ret;
        })
      }
      return Promise.resolve(undefined);
    })
  }

  public getEnvironments(username: string) {
    return this.database.runQuery("admin", "get-environments-for-user", { username: username })
    .then((results) => {
      return Lodash.map(results, (result) => {
        return {
          username: result.username,
          name: result.name,
          host: result.host,
          port: result.port
        }
      })
    })
  }
}
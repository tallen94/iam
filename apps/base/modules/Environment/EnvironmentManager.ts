import { Database } from "../modules";
import { FileSystemCommunicator } from "../Communicator/FileSystemCommunicator";
import Lodash from "lodash";
import uuid from "uuid";

export class EnvironmentManager {

  constructor(
    private database: Database,
    private fileSystemCommunicator: FileSystemCommunicator
  ) { }

  public addEnvironment(data: any) {
    const envData = JSON.stringify({host: data.host, port: data.port})
    return this.getEnvironment(data.username, data.name)
    .then((result) => {
      if (result == undefined) {
        return this.database.runQuery("admin", "add-exe", {
          username: data.username, 
          name: data.name,
          uuid: uuid.v4(),
          exe: data.exe,
          data: envData,
          input: data.input,
          output: data.output,
          description: data.description,
          environment: "base"
        })
      }
      return this.database.runQuery("admin", "update-exe", { 
        name: data.name,
        exe: data.exe,
        data: envData,
        input: data.input,
        output: data.output,
        description: data.description,
        environment: "base"
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
    return this.database.runQuery("admin", "get-exe-by-type-name", { username: username, name: name, exe: "environment" })
    .then((result) => {
      if (result.length > 0) {
        const item = result[0];
        const data = JSON.parse(item.data);
        const ret = {
          username: item.username,
          name: item.name,
          exe: item.exe,
          host: data.host,
          port: data.port,
          input: item.input,
          output: item.output,
          description: item.description,
          environment: item.environment
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
    return this.database.runQuery("admin", "get-exe-for-user", { exe: "environment", username: username })
    .then((results) => {
      return Lodash.map(results, (result) => {
        return {
          username: result.username,
          name: result.name,
          description: result.description
        }
      })
    })
  }

  public getImageFile(filename: string) {
    return this.fileSystemCommunicator.getImage(filename);
  }
}
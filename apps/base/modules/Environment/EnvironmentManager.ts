import { Database } from "../modules";
import { FileSystemCommunicator } from "../Communicator/FileSystemCommunicator";
import Lodash from "lodash";
import uuid from "uuid";
import * as FS from "fs";
import { FileSystem } from "../FileSystem/FileSystem";
import { Shell } from "../Executor/Shell";

export class EnvironmentManager {

  constructor(
    private fileSystem: FileSystem,
    private shell: Shell,
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
          environment: data.environment
        })
      }
      return this.database.runQuery("admin", "update-exe", { 
        name: data.name,
        exe: data.exe,
        data: envData,
        input: data.input,
        output: data.output,
        description: data.description,
        environment: data.environment
      })
    }).then(() => {
      return Promise.all([
        this.fileSystemCommunicator.putFile("images", {
          name: data.name,
          file: data.image
        }), 
        this.fileSystemCommunicator.putFile("kubernetes", {
          name: data.name,
          file: data.kubernetes
        })
      ])
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
        return Promise.all([
          this.fileSystemCommunicator.getFile("images", item.name),
          this.fileSystemCommunicator.getFile("kubernetes", item.name)
        ]).then((result) => {
          ret["image"] = result[0];
          ret["kubernetes"] = result[1]
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

  public runEnvironment(username: string, name: string, data: any) {
    return this.getEnvironment(username, name)
    .then((environment) => {
      return this.shell.runProgram("admin", "build-environment", {tag: data.tag, image: name})
      .then((result) => {
        return result;
      })
    })
  }

  public getImageFile(filename: string) {
    return this.fileSystemCommunicator.getFile("images", filename);
  }

  public getKubernetesFile(filename: string) {
    return this.fileSystemCommunicator.getFile("kubernetes", filename);
  }
}
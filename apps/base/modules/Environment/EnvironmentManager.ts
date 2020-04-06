import { FileSystemCommunicator } from "../Communicator/FileSystemCommunicator";
import Lodash from "lodash";
import uuid from "uuid";
import { FileSystem } from "../FileSystem/FileSystem";
import { ExecutableFactory } from "../Executable/ExecutableFactory";
import { Query } from "../Executable/Query";

export class EnvironmentManager {

  constructor(
    private fileSystem: FileSystem,
    private fileSystemCommunicator: FileSystemCommunicator,
    private executableFactory: ExecutableFactory
  ) { }

  public addEnvironment(data: any) {
    const envData = JSON.stringify({
      imageRepo: data.imageRepo,
      replicas: data.replicas,
      memory: data.memory,
      cpu: data.cpu,
      type: data.type
    })
    return this.getEnvironment(data.username, data.name)
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
            data: envData,
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
          data: envData,
          input: data.input,
          output: data.output,
          description: data.description,
          environment: data.environment,
          visibility: data.visibility
        })
      })
    }).then(() => {
      let promise;
      if (data.type == "executor") {
        promise = this.kubernetesTemplate(data)
      } else {
        promise = Promise.resolve(data.kubernetes)
      }

      return Promise.all([
        this.fileSystemCommunicator.putFile(data.username + "/images", {
          name: data.name,
          file: data.image
        }),
        promise.then((kubernetes) => {
          return this.fileSystemCommunicator.putFile(data.username + "/kubernetes", {
            name: data.name,
            file: kubernetes
          })
        }) 
      ])
    })
  }

  public getEnvironment(username: string, name: string) {
    return this.executableFactory.query({
      username: "admin", 
      name: "get-exe-by-type-name"
    }).then((query: Query) => {
      return query.run({ username: username, name: name, exe: "environment" })
    }).then((result) => {
      if (result.length > 0) {
        const item = result[0];
        const data = JSON.parse(item.data);
        const ret = {
          username: item.username,
          name: item.name,
          exe: item.exe,
          replicas: data.replicas,
          cpu: data.cpu,
          memory: data.memory,
          imageRepo: data.imageRepo,
          type: data.type,
          input: item.input,
          output: item.output,
          description: item.description,
          environment: item.environment,
          visibility: item.visibility
        }
        return Promise.all([
          this.fileSystemCommunicator.getFile(username + "/images", item.name),
          this.fileSystemCommunicator.getFile(username + "/kubernetes", item.name)
        ]).then((result) => {
          ret["image"] = result[0];
          ret["kubernetes"] = result[1]
          return ret;
        })
      }
      return Promise.resolve(undefined);
    })
  }

  public getImageFile(username: string, filename: string) {
    return this.fileSystemCommunicator.getFile(username + "/images", filename);
  }

  public getKubernetesFile(username: string, filename: string) {
    return this.fileSystemCommunicator.getFile(username + "/kubernetes", filename);
  }

  private kubernetesTemplate(data: any) {
    return this.fileSystemCommunicator.getFile(data.username + "/templates/kubernetes", "executor.yaml")
    .then((file: string) => {
      return this.replace(file, data)
    })
  }

  private replace(s: string, data: any): string {
    const re = new RegExp("{root}", "g");
    s = s.replace(re, this.fileSystem.getRoot());
    Lodash.each(data, (value, key) => {
      const re = new RegExp("{" + key + "}", "g");
      s = s.replace(re, value);
    });
    return s;
  }
}
import { FileSystemCommunicator } from "../Communicator/FileSystemCommunicator";
import Lodash from "lodash";
import uuid from "uuid";
import { FileSystem } from "../FileSystem/FileSystem";
import { DatabaseCommunicator } from "../Communicator/DatabaseCommunicator";
import { Queries } from "../Constants/Queries";

export class EnvironmentManager {

  constructor(
    private fileSystem: FileSystem,
    private fileSystemCommunicator: FileSystemCommunicator,
    private databaseCommunicator: DatabaseCommunicator
  ) { }

  public addEnvironment(data: any) {
    const envData = JSON.stringify(data.data)
    return this.getEnvironment(data.username, data.name, data.cluster)
    .then((result) => {
      if (result == undefined) {
        return this.databaseCommunicator.execute(Queries.ADD_ENVIRONMENT, {
          username: data.username, 
          name: data.name,
          data: envData,
          cluster: data.cluster,
          description: data.description
        })
      }
      return this.databaseCommunicator.execute(Queries.UPDATE_ENVIRONMENT, { 
        username: data.username, 
        name: data.name,
        data: envData,
        cluster: data.cluster,
        description: data.description
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

  public getEnvironment(username: string, name: string, cluster: string) {
    return this.databaseCommunicator.execute(Queries.GET_ENVIRONMENT, { username: username, name: name, cluster: cluster })
    .then((result: any[]) => {
      if (result.length > 0) {
        const item = result[0];
        const data = JSON.parse(item.data);
        const ret = {
          username: item.username,
          name: item.name,
          cluster: item.cluster,
          data: data,
          description: item.description,
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

  public getEnvironmentForUser(username: string) {
    return this.databaseCommunicator.execute(Queries.GET_ENVIRONMENT_FOR_USER, {username: username})
    .then((results) => {
      return Promise.all(Lodash.map(results, (item) => {
        const data = JSON.parse(item.data);
        const ret = {
          username: item.username,
          name: item.name,
          cluster: item.cluster,
          data: data,
          description: item.description,
        }
        return Promise.all([
          this.fileSystemCommunicator.getFile(username + "/images", item.name),
          this.fileSystemCommunicator.getFile(username + "/kubernetes", item.name)
        ]).then((result) => {
          ret["image"] = result[0];
          ret["kubernetes"] = result[1]
          return ret;
        })
      }))
    })
  }

  public getEnvironmentsForCluster(cluster: string, username: string) {
    return this.databaseCommunicator.execute(Queries.GET_ENVIRONMENTS_FOR_CLUSTER, {cluster: cluster, username: username})
    .then((results) => {
      return Promise.all(Lodash.map(results, (item) => {
        const data = JSON.parse(item.data);
        const ret = {
          username: item.username,
          name: item.name,
          cluster: item.cluster,
          data: data,
          description: item.description,
        }
        return Promise.all([
          this.fileSystemCommunicator.getFile(username + "/images", item.name),
          this.fileSystemCommunicator.getFile(username + "/kubernetes", item.name)
        ]).then((result) => {
          ret["image"] = result[0];
          ret["kubernetes"] = result[1]
          return ret;
        })
      }))
    })
  }

  public deleteEnvironment(username: string, name: string, cluster: string) {
    return this.databaseCommunicator.execute(Queries.DELETE_ENVIRONMENT, {username: username, name: name, cluster: cluster})
    .then((result) => {
      return Promise.all([
        this.fileSystemCommunicator.deleteFile(username + "/images", name),
        this.fileSystemCommunicator.deleteFile(username + "/kubernetes", name),
      ])
    })
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
import { FileSystemCommunicator } from "../Communicator/FileSystemCommunicator";
import Lodash from "lodash";
import { FileSystem } from "../FileSystem/FileSystem";
import { DatabaseCommunicator } from "../Communicator/DatabaseCommunicator";
import { Queries } from "../Constants/Queries";
import { ShellCommunicator } from "../Communicator/ShellCommunicator";
import { Functions } from "../Constants/Functions";
import uuid from "uuid";
import { Templates } from "../Constants/Templates";

export class EnvironmentManager {

  constructor(
    private fileSystem: FileSystem,
    private fileSystemCommunicator: FileSystemCommunicator,
    private databaseCommunicator: DatabaseCommunicator,
    private shellCommunicator: ShellCommunicator
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
          description: data.description,
          state: data.state
        })
      }
      return this.databaseCommunicator.execute(Queries.UPDATE_ENVIRONMENT, { 
        username: data.username, 
        name: data.name,
        data: envData,
        cluster: data.cluster,
        description: data.description,
        state: data.state
      })
    }).then(() => {
      let kubernetes;
      const serviceOptions = {
        "Executor": Templates.EXECUTOR_SERVICE,
        "Database": Templates.DATABASE_SERVICE,
        "NodePort": Templates.NODEPORT_SERVICE,
        "LoadBalancer": Templates.LOADBALANCER_SERVICE
      }
      const storageTypes = {
        "None": Templates.NONE,
        "Local": Templates.LOCAL_VOLUME,
        "AwsElb": Templates.ELB_VOLUME,
        "Ocean": Templates.OCEAN_VOLUME
      }
      const applicationTemplates = {
        "Executor": Templates.EXECUTOR_TEMPLATE,
        "Database": Templates.DATABASE_TEMPLATE,
        "NodePort": Templates.EXECUTOR_TEMPLATE,
        "LoadBalancer": Templates.EXECUTOR_TEMPLATE
      }
      data.storage = this.kubernetesTemplate(data, data.data, storageTypes[data.data.storageType])
      data.service = this.kubernetesTemplate(data, data.data, serviceOptions[data.data.serviceType])
      data.environmentVariables = this.environmentVariablesTemplate(data.data.serviceType, data.data.variables)
      kubernetes = this.kubernetesTemplate(data, data.data, applicationTemplates[data.data.serviceType])
      return this.fileSystemCommunicator.putFile("kubernetes", {
        name: this.environmentFullName(data.username, data.cluster, data.name),
        file: kubernetes
      }) 
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
          state: item.state
        }
        return this.fileSystemCommunicator.getFile("kubernetes", this.environmentFullName(item.username, item.cluster, item.name))
        .then((result) => {
          ret["kubernetes"] = result
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
          state: item.state
        }
        return this.fileSystemCommunicator.getFile("kubernetes", this.environmentFullName(item.username, item.cluster, item.name))
        .then((result) => {
          ret["kubernetes"] = result
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
          state: item.state
        }
        return this.fileSystemCommunicator.getFile("kubernetes", this.environmentFullName(item.username, item.cluster, item.name))
        .then((result) => {
          ret["kubernetes"] = result
          return ret;
        })
      }))
    })
  }

  public deleteEnvironment(username: string, name: string, cluster: string) {
    return this.databaseCommunicator.execute(Queries.DELETE_ENVIRONMENT, {username: username, name: name, cluster: cluster})
    .then((result) => {
      return this.fileSystemCommunicator.deleteFile("kubernetes", this.environmentFullName(username, cluster, name))
    })
  }

  public startEnvironment(username: string, name: string, cluster: string) {
    return this.getEnvironment(username, name, cluster)
    .then((environment) => {
      const fileUid = uuid.v4()
      return this.fileSystem.put("run", fileUid, environment.kubernetes)
      .then(() => {
        return this.shellCommunicator.exec(Functions.KUBECTL_APPLY, "bash", "{file}", {
          file: this.fileSystem.path("run/" + fileUid)
        })
      }).then((result) => {
        if (result.err) {
          return { result: result.err, state: environment.state }
        }
        environment.state = 'RUNNING'
        return this.addEnvironment(environment)
        .then((result) => {
          return this.fileSystem.delete(this.fileSystem.path("run/" + fileUid))
        }).then(() => {
          return { result: result, state: environment.state }
        })
      })
    })
  }

  public stopEnvironment(username: string, name: string, cluster: string) {
    return this.getEnvironment(username, name, cluster)
    .then((environment) => {
      const fileUid = uuid.v4()
      return this.fileSystem.put("run", fileUid, environment.kubernetes)
      .then(() => {
        return this.shellCommunicator.exec(Functions.KUBECTL_DELETE, "bash", "{file}", {
          file: this.fileSystem.path("run/" + fileUid)
        })
      }).then((result) => {
        if (result.err) {
          return { result: result.err, state: environment.state }
        }
        environment.state = 'STOPPED'
        return this.addEnvironment(environment)
        .then((result) => {
          return this.fileSystem.delete(this.fileSystem.path("run/" + fileUid))
        }).then(() => {
          return { result: result, state: environment.state }
        })
      })
    })
  }

  public getEndpoints(username: string, name: string, cluster: string) {
    return this.shellCommunicator.exec(Functions.GET_ENDPOINTS, "bash", "{service}", {
      service: this.environmentFullName(username, cluster, name)
    })
  }

  private kubernetesTemplate(data: any, otherData: any, template: string) {
    return this.replace(this.replace(template, data), otherData)
  }

  private environmentVariablesTemplate(serviceType: string, variables: any[]) {
    let s = ""
    const variableTemplates = {
      Executor: {
        Plaintext: Templates.EXECUTOR_PLAINTEXT_VARIABLE,
        Secret: Templates.EXECUTOR_SECRET_VARIABLE
      },
      Database: {
        Plaintext: Templates.DATABASE_PLAINTEXT_VARIABLE,
        Secret: Templates.DATABASE_SECRET_VARIABLE
      }
    }
    variables.forEach(variable => {
      s = s + this.replace(variableTemplates[serviceType][variable.type], variable) + "\n"
    });
    return s;
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

  private environmentFullName(username: string, cluster: string, name: string) {
    return [username, cluster, name].join("-")
  }
}
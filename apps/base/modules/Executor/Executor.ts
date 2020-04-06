import {
  Shell,
  Database
} from "../modules";
import * as Lodash from "lodash";
import { JobRunner } from "../Job/JobRunner";
import { GraphExecutor } from "./GraphExecutor";
import { EnvironmentManager } from "../Environment/EnvironmentManager";
import { PoolManager } from "../Pool/PoolManager";
import { Authorization } from "../Auth/Authorization";
import { ExecutableManager } from "../Executable/ExecutableManager";
import { ExecutableFactory } from "../Executable/ExecutableFactory";
import { Query } from "../Executable/Query";

export class Executor {

  private jobRunner: JobRunner;

  constructor(
    private database: Database,
    private shell: Shell,
    private environmentManager: EnvironmentManager,
    private graphExecutor: GraphExecutor,
    private poolManager: PoolManager,
    private authorization: Authorization,
    private executableManager: ExecutableManager,
    private executableFactory: ExecutableFactory) {
  }

  public setJobRunner(jobRunner: JobRunner) {
    this.jobRunner = jobRunner;
  }

  public status(): Promise<any> {
    return Promise.all([
      this.shell.getStatus(),
      this.database.getStatus()
    ]);
  }

  public addExecutable(data: any) {
    switch (data.exe) {
      case "function":
        // check if user can write to environment
        // a user can write to an environment if they own it
        return this.authorization.validateUserOwnsEnvironment(data.username, data.environment, () => {
          return this.shell.addProgram(data);
        })
      case "query":
        return this.authorization.validateUserOwnsEnvironment(data.username, data.environment, () => {
          return this.database.addQuery(data);
        })
      case "graph":
        return this.authorization.validateUserOwnsEnvironment(data.username, data.environment, () => {
          return this.graphExecutor.addGraph(data);
        })
      case "job":
        return this.jobRunner.addJob(data);
      case "environment":
        return this.environmentManager.addEnvironment(data);
      // case "pool":
      //   return this.poolManager.addPool(data);
    }
  }

  public getExecutable(username: string, name: string, exe: string): Promise<any> {
    return this.hydrateStepJson({name: name, exe: exe, username: username});
  }

  private hydrateStepJson(data: any) {
    return this.executableFactory.query({
      username: "admin", 
      name: "get-exe-by-type-name"
    }).then((query: Query) => {
      return query.run({name: data.name, exe: data.exe, username: data.username})
    }).then((result) => {
      let stepJson;
      if (result.length == 0) {
        return;
      } 

      stepJson = result[0];
      switch (stepJson.exe) {
        case "pipe":
        case "async":
        case "eachnode":
        case "foreach":
          return Promise.resolve(undefined);
        case "function":
          return this.shell.getProgramFile(stepJson.username, stepJson.name)
          .then((file) => {
            const data = JSON.parse(stepJson.data);
            return {
              username: stepJson.username,
              name: stepJson.name,
              exe: stepJson.exe,
              description: stepJson.description,
              input: stepJson.input,
              output: stepJson.output,
              text: file,
              args: data.args,
              command: data.command,
              environment: stepJson.environment,
              visibility: stepJson.visibility
            };
          });
        case "graph":
          const graph = JSON.parse(stepJson.data);
          return this.hydrateExecutables(graph.nodes)
          .then((nodes) => {
            graph.nodes = nodes;
            return Promise.resolve({
              username: stepJson.username,
              name: stepJson.name,
              exe: stepJson.exe,
              description: stepJson.description,
              input: stepJson.input,
              output: stepJson.output,
              graph: graph,
              environment: stepJson.environment,
              foreach: graph.foreach,
              visibility: stepJson.visibility
            });
          });
        case "query":
          return this.database.getQueryFile(stepJson.username, stepJson.name)
          .then((file) => {
            return Promise.resolve({
              username: stepJson.username,
              name: stepJson.name,
              exe: stepJson.exe,
              description: stepJson.description,
              input: stepJson.input,
              output: stepJson.output,
              text: file,
              environment: stepJson.environment,
              visibility: stepJson.visibility
            });
          })
        case "environment":
          return Promise.all([
            this.environmentManager.getImageFile(stepJson.username, stepJson.name),
            this.environmentManager.getKubernetesFile(stepJson.username, stepJson.name)
          ]) 
          .then((files) => {
            const data = JSON.parse(stepJson.data);
            return {
              username: stepJson.username,
              name: stepJson.name,
              exe: stepJson.exe,
              description: stepJson.description,
              input: stepJson.input,
              output: stepJson.output,
              image: files[0],
              kubernetes: files[1],
              replicas: data.replicas,
              cpu: data.cpu,
              memory: data.memory,
              imageRepo: data.imageRepo,
              type: data.type,
              environment: stepJson.environment,
              visibility: stepJson.visibility
            };
          })
        // case "pool":
        //   const data = JSON.parse(stepJson.data)
        //   return Promise.resolve({
        //     username: stepJson.username,
        //     name: stepJson.name,
        //     exe: stepJson.exe,
        //     description: stepJson.description,
        //     input: stepJson.input,
        //     output: stepJson.output,
        //     executableUsername: data.username,
        //     executableExe: data.exe,
        //     executableName: data.name,
        //     poolSize: data.poolSize,
        //     environment: stepJson.environment,
        //     visibility: stepJson.visibility
        //   })
      }
    });
  }

  private hydrateExecutables(nodes: any[]) {
    return Promise.all(Lodash.map(nodes, (node) => {
      return this.getExecutable(node.username, node.name, node.exe)
      .then((exe) => {
        return Object.assign(node, exe);
      });
    }));
  }

  public getExecutables(username: string, exe: string): Promise<any> {
    return this.executableFactory.query({
      username: "admin", 
      name: "get-exe-for-user"
    }).then((query: Query) => {
      return query.run({ exe: exe, username: username })
    }).then((data) => {
      return Promise.all(Lodash.map(data, (item) => {
        return this.executableFactory.query({
          username: "admin", 
          name: "search-steplists"
        }).then((query: Query) => {
          return query.run({query: "%name\":\"" + item.name + "\"%"})
        }).then((results) => {
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

  public runExecutable(username: string, name: string, exe: string, data: any, token: string) {
    return this.executableManager.runExecutable(username, name, exe, data, token);
  }

  public searchExecutables(searchText: string) {
    return this.executableFactory.query({
      username: "admin", 
      name: "search-executable"
    }).then((query: Query) => {
      return query.run({searchText: searchText})
    }).then((results) => {
      const groups = {};
      Lodash.each(results, (item) => {
        if (groups[item.exe] == undefined) {
          groups[item.exe] = [];
        }

        groups[item.exe].push(item);
      });
      return groups;
    });
  }

  public getShell(): Shell {
    return this.shell;
  }

  public getDatabase(): Database {
    return this.database;
  }
}
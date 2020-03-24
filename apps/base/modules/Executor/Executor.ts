import {
  Shell,
  Database
} from "../modules";
import * as Lodash from "lodash";
import { JobRunner } from "../Job/JobRunner";
import { GraphExecutor } from "./GraphExecutor";
import { EnvironmentManager } from "../Environment/EnvironmentManager";
import { PoolManager } from "../Pool/PoolManager";

export class Executor {

  private jobRunner: JobRunner;

  constructor(
    private database: Database,
    private shell: Shell,
    private environmentManager: EnvironmentManager,
    private graphExecutor: GraphExecutor,
    private poolManager: PoolManager) {
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
        return this.validateUserOwnsEnvironment(data.username, data.environment)
        .then((userOwnsEnvironment) => {
          if (userOwnsEnvironment) {
            // the user owns the environment
            return this.shell.addProgram(data);
          } 
          return "Environment named " + data.environment + " does not exist"
        })
      case "query":
        return this.validateUserOwnsEnvironment(data.username, data.environment)
        .then((userOwnsEnvironment) => {
          if (userOwnsEnvironment) {
            // the user owns the environment
            return this.database.addQuery(data);
          } 
          return "Environment named " + data.environment + " does not exist"
        })
      case "graph":
        return this.validateUserOwnsEnvironment(data.username, data.environment)
        .then((userOwnsEnvironment) => {
          if (userOwnsEnvironment) {
            // the user owns the environment
            return this.graphExecutor.addGraph(data);
          } 
          return "Environment named " + data.environment + " does not exist"
        })
      case "job":
        return this.jobRunner.addJob(data);
      case "environment":
        return this.environmentManager.addEnvironment(data);
      case "pool":
        return this.poolManager.addPool(data);
    }
  }

  private validateUserOwnsEnvironment(username: string, environment: string) {
    return this.database.runQuery("admin", "get-exe-by-type-name", {username: username, exe: 'environment', name: environment})
    .then((results) => {
      return results.length > 0
    })
  }

  public getExecutable(username: string, name: string, exe: string): Promise<any> {
    return this.hydrateStepJson({name: name, exe: exe, username: username});
  }

  private hydrateStepJson(data: any) {
    return this.database.runQuery("admin", "get-exe-by-type-name", {name: data.name, exe: data.exe, username: data.username})
    .then((result) => {
      let stepJson;
      if (result.length == 0) {
        return;
      } 

      stepJson = result[0];
      switch (stepJson.exe) {
        case "pipe":
        case "async":
          return Promise.all(Lodash.map(stepJson.steps || JSON.parse(stepJson.data), (step) => {
            return this.hydrateStepJson(step);
          })).then((result) => {
            return {
              username: stepJson.username,
              name: stepJson.name,
              exe: stepJson.exe,
              description: stepJson.description,
              input: stepJson.input,
              output: stepJson.output,
              steps: result
            };
          });
        case "eachnode":
        case "foreach":
          return this.hydrateStepJson(stepJson.step || JSON.parse(stepJson.data))
          .then((result) => {
            return {
              username: stepJson.username,
              name: stepJson.name,
              exe: stepJson.exe,
              description: stepJson.description,
              input: stepJson.input,
              output: stepJson.output,
              step: result
            };
          });
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
              environment: stepJson.environment
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
              foreach: graph.foreach
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
              environment: stepJson.environment
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
              host: data.host,
              port: data.port,
              replicas: data.replicas,
              cpu: data.cpu,
              memory: data.memory,
              imageRepo: data.imageRepo,
              type: data.type,
              environment: stepJson.environment
            };
          })
        case "pool":
          const data = JSON.parse(stepJson.data)
          return Promise.resolve({
            username: stepJson.username,
            name: stepJson.name,
            exe: stepJson.exe,
            description: stepJson.description,
            input: stepJson.input,
            output: stepJson.output,
            executableUsername: data.username,
            executableExe: data.exe,
            executableName: data.name,
            poolSize: data.poolSize,
            environment: stepJson.environment
          })
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
    switch (exe) {
      case "function":
        return this.shell.getPrograms(username);
      case "query":
        return this.database.getQueries(username);
      case "job":
        return this.jobRunner.getJobs(username);
      case "graph":
        return this.graphExecutor.getGraphs(username);
      case "environment":
        return this.environmentManager.getEnvironments(username);
      case "pool":
        return this.poolManager.getPools(username)
    }
  }

  public runExecutable(username: string, name: string, exe: string, data: any) {
    switch (exe) {
      case "function":
        if (this.poolManager.hasPool(username, name, exe)) {
          return this.poolManager.useDroplet(username, name, exe, data)
        }
        return this.shell.runProgram(username, name, data);
      case "query":
        return this.database.runQuery(username, name, data);
      case "graph":
        return this.graphExecutor.runGraph(username, name, data);
      case "environment":
        return this.environmentManager.runEnvironment(username, name, data);
      case "pool":
        return this.poolManager.runPool(username, name, data)
    }
  }

  public searchExecutables(searchText: string) {
    return this.database.runQuery("admin", "search-executable", {searchText: searchText})
    .then((results) => {
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
import {
  Shell,
  Database
} from "../modules";
import * as Lodash from "lodash";
import { JobRunner } from "../Job/JobRunner";
import { GraphExecutor } from "./GraphExecutor";
import { EnvironmentManager } from "../Environment/EnvironmentManager";
import { PoolManager } from "../Pool/PoolManager";
import { DatabaseCommunicator } from "../Communicator/DatabaseCommunicator";
import { Queries } from "../Constants/Queries";
import { ExecutableFactory } from "../Executable/ExecutableFactory";
import { AuthorizationClient } from "../Client/AuthorizationClient";

export class Executor {

  private jobRunner: JobRunner;

  constructor(
    private database: Database,
    private shell: Shell,
    private environmentManager: EnvironmentManager,
    private graphExecutor: GraphExecutor,
    private poolManager: PoolManager,
    private executableFactory: ExecutableFactory,
    private databaseCommunicator: DatabaseCommunicator,
    private authorizationClient: AuthorizationClient) {
  }

  public addExecutable(data: any) {
    switch (data.exe) {
      case "function":
        // check if user can write to environment
        // a user can write to an environment if they own it
        return this.shell.addProgram(data);
      case "query":
        return this.database.addQuery(data);
      case "graph":
        return this.graphExecutor.addGraph(data);
      case "environment":
        return this.environmentManager.addEnvironment(data);
      // case "job":
      //   return this.jobRunner.addJob(data);
      // case "pool":
      //   return this.poolManager.addPool(data);
    }
  }

  public getExecutable(username: string, name: string, exe: string): Promise<any> {
    switch (exe) {
      case "function":
        return this.shell.getProgram(username, name)
      case "query":
        return this.database.getQuery(username, name)
      case "environment":
        return this.environmentManager.getEnvironment(username, name)
      case "graph":
        return this.graphExecutor.getGraph(username, name)
        .then((graph) => {
          return this.hydrateExecutables(graph.graph.nodes)
          .then((nodes) => {
            graph.graph.nodes = nodes;
            return graph;
          });
        });
    }
  }

  public getExecutables(username: string, exe: string): Promise<any> {
    return this.databaseCommunicator.execute(Queries.GET_EXE_FOR_USER, {username: username, exe: exe})
    .then((results: any[]) => {
      return Promise.all(Lodash.map(results, (item) => {
        return {
          username: item.username,
          name: item.name,
          description: item.description
        };
      }));
    });
  }

  public deleteExecutable(username: string, exe: string, name: string) {
    switch (exe) {
      case "function":
        return this.shell.deleteProgram(username, name)
      case "query":
        return this.database.deleteQuery(username, name)
      case "environment":
        return this.environmentManager.deleteEnvironment(username, name)
      case "graph":
        return this.graphExecutor.deleteGraph(username, name)
    }
  }

  public runExecutable(username: string, name: string, exe: string, data: any, token: string) {
    return this.getExecutable(username, name, exe)
    .then((executable: any) => {
      return this.executableFactory[exe](executable).run(data)
    })
  }

  public searchExecutables(searchText: string) {
    return this.databaseCommunicator.execute(Queries.SEARCH_EXECUTABLES, {searchText: searchText})
    .then((results: any[]) => {
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

  // private handleAuth(executable: Executable, token: string, complete: () => Executable) {
  //   switch (executable.getVisibility()) {
  //     case "auth":
  //       return this.authorization.validateUserToken(executable.getUsername(), token, complete)
  //     case "private":
  //       return this.authorization.validateClusterToken(token, complete)
  //     case "public":
  //       return complete()
  //   }
  // }

  private hydrateExecutables(nodes: any[]) {
    return Promise.all(Lodash.map(nodes, (node) => {
      return this.getExecutable(node.username, node.name, node.exe)
      .then((exe) => {
        return Object.assign(node, exe);
      });
    }));
  }
}
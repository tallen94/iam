import { ClientCommunicator } from "../Communicator/ClientCommunicator";
import { GraphExecutor } from "./GraphExecutor";
import { ApiPaths } from "../Api/ApiPaths";

export class Master {

  constructor(
    private environments: { [key: string]: ClientCommunicator },
    private graphExecutor: GraphExecutor
  ) { }

  public addExecutable(env: string, exe: string, data: any) {
    switch (exe) {
      case "function":
      case "query":
        return this.environments[env].post(ApiPaths.ADD_EXECUTABLE, data)
      case "graph":
        return this.graphExecutor.addGraph(data);
    }
  } 

  public getExecutable(env: string, exe: string, username: string, name: any) {
    switch (exe) {
      case "function":
      case "query":
        return this.environments[env].get(ApiPaths.GET_EXECUTABLE, {username: username, name: name, exe: exe});
      case "graph":
        return this.graphExecutor.getGraph(username, name);
    }
  }

  public getExecutables(env: string, exe: string, username: string) {
    switch (exe) {
      case "function":
      case "query":
        return this.environments[env].get(ApiPaths.GET_EXECUTABLES, {username: username, exe: exe});
      case "graph":
        return this.graphExecutor.getGraphs(username);
    }
  }

  public runExecutable(env: string, exe: string, username: string, name: string, data: any) {
    switch (exe) {
      case "function":
      case "query":
        return this.environments[env].post(ApiPaths.RUN_EXECUTABLE, data, {username: username, exe: exe, name: name});
      case "graph":
        return this.graphExecutor.runGraph(name, data)
    }
  }
}
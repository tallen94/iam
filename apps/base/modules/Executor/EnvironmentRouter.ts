import { ClientCommunicator } from "../Communicator/ClientCommunicator";
import { ApiPaths } from "../Api/ApiPaths";
import { Executor } from "./Executor";
import { Authorization } from "../Auth/Authorization";

export class EnvironmentRouter {

  constructor(
    private executor: Executor,
    private authorization: Authorization
  ) {}

  public addExecutable(data: any, token: string) {
    return this.authorization.validateUserToken(data.username, token)
    .then((authorized) => {
      if (authorized) {
        // User authorized to add executables for themselves
        return this.executor.addExecutable(data);
      } else {
        return "Unauthorized"
      }
    })
  }

  public getExecutable(username: string, name: string, exe: string) {
    return this.executor.getExecutable(username, name, exe)
  }

  public getExecutables(username: string, exe: string) {
    return this.executor.getExecutables(username, exe)
  }

  public runExecutable(exe: string, username: string, name: string, data: any) {
    return this.executor.runExecutable('admin', 'get-exe-environment', "query", {username: username, name: name, exe: exe})
    .then((results) => {
      if (results.length > 0) {
        const env = JSON.parse(results[0].data);
        const client: ClientCommunicator = new ClientCommunicator(env.host, env.port)
        return client.post(ApiPaths.RUN_EXECUTABLE, data, {username: username, exe: exe, name: name});
      }
    })
  }

  public searchExecutables(searchText: string) {
    return this.executor.searchExecutables(searchText)
  }
}
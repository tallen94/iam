import { ClientCommunicator } from "../Communicator/ClientCommunicator";
import { ApiPaths } from "../Api/ApiPaths";
import { Executor } from "./Executor";
import { Authorization } from "../Auth/Authorization";
import { Client } from "./Client";

export class EnvironmentRouter {

  constructor(
    private executor: Executor,
    private authorization: Authorization
  ) {}

  public addExecutable(data: any, token: string) {
    return this.authorization.validateUserToken(data.username, token, this.executor.getDatabase(), () => {
      return this.executor.addExecutable(data);
    })
  }

  public getExecutable(username: string, name: string, exe: string) {
    return this.executor.getExecutable(username, name, exe)
  }

  public getExecutables(username: string, exe: string) {
    return this.executor.getExecutables(username, exe)
  }

  public runExecutable(exe: string, username: string, name: string, data: any, token: string) {
    return this.executor.runExecutable('admin', 'get-exe-environment', "query", {username: username, name: name, exe: exe}, token)
    .then((results) => {
      if (results.length > 0) {
        const environment = results[0]
        const host = environment.name + "." + username
        const clientCommunicator: ClientCommunicator = new ClientCommunicator(host, 80)
        const client: Client = new Client(clientCommunicator);
        return client.runExecutable(username, exe, name, data, token);
      }
    })
  }

  public searchExecutables(searchText: string) {
    return this.executor.searchExecutables(searchText)
  }
}
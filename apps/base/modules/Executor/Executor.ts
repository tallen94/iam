import { ExecutableFactory } from "../Executable/ExecutableFactory";
import { Client } from "../Client/Client";
import { AuthData } from "../Auth/AuthData";

export class Executor {

  constructor(
    private client: Client,
    private executableFactory: ExecutableFactory) {
  }

  public runExecutable(username: string, cluster: string, environment: string, exe: string, name: string, data: any, authData: AuthData) {
    return this.client.getExecutable(username, cluster, environment, exe, name, authData)
    .then((executable) => {
      return this.executableFactory[exe](executable).run(data, authData)
    })
  }
}
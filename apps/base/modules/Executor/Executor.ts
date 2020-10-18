import { ExecutableFactory } from "../Executable/ExecutableFactory";
import { Client } from "../Client/Client";
import { AuthorizationClient } from "../Client/AuthorizationClient";
import { AuthenticationClient } from "../Client/AuthenticationClient";

export class Executor {

  constructor(
    private client: Client,
    private executableFactory: ExecutableFactory,
    private authorizationClient: AuthorizationClient,
    private authenticationClient: AuthenticationClient) {
  }

  public runExecutable(username: string, cluster: string, environment: string, exe: string, name: string, data: any, authData: any) { 
    return this.authenticationClient.validateAuthData(authData, username, () => {
      return this.client.getExecutable(username, cluster, environment, exe, name, authData)
      .then((executable) => {
        return this.executableFactory[exe](executable).run(data)
      })
    })
  }
}
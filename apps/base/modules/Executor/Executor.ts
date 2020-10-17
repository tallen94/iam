import { ExecutableFactory } from "../Executable/ExecutableFactory";
import { Client } from "../Client/Client";

export class Executor {

  constructor(
    private client: Client,
    private executableFactory: ExecutableFactory) {
  }

  public runExecutable(username: string, cluster: string, environment: string, exe: string, name: string, data: any) {
    return this.client.getExecutable(username, cluster, environment, exe, name)
    .then((executable) => {
      return this.executableFactory[exe](executable).run(data)
    })
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
}
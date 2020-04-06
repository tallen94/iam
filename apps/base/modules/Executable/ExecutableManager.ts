import { Executable } from "./Executable";
import { ExecutableFactory } from "./ExecutableFactory";
import { Authorization } from "../Auth/Authorization";
import { Query } from "./Query";

export class ExecutableManager {

  constructor(
    private executableFactory: ExecutableFactory,
    private authorization: Authorization) {

  }

  public getExecutable(username: string, name: string, exe: string): Promise<Executable> {
    return this.executableFactory.query({
      username: "admin",
      name: "get-exe-by-type-name"
    }).then((query: Query) => {
      return query.run({username: username, name: name, exe: exe})
    }).then((result) => {
      if (result.length > 0) {
        return this.executableFactory[exe](result[0])
      }
      return undefined
    })
  }

  public runExecutable(username: string, name: string, exe: string, data: any, token: string) {
    return this.getExecutable(username, name, exe)
    .then((executable) => {
      return this.handleAuth(executable, token, () => {
        return executable
      })
    }).then((executable) => {
      return executable.run(data)
    })
  }

  private handleAuth(executable: Executable, token: string, complete: () => Executable) {
    switch (executable.getVisibility()) {
      case "auth":
        return this.authorization.validateUserToken(executable.getUsername(), token, complete)
      case "private":
        return this.authorization.validateClusterToken(token, complete)
      case "public":
        return complete()
    }

  }
}
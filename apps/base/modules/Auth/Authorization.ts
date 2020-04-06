import { Database } from "../Executor/Database";
import { ExecutableFactory } from "../Executable/ExecutableFactory";
import { Query } from "../Executable/Query";

export class Authorization {

  // Permissions can require or not require a user to have a session token.
  // Read, Write, Execute
  //
  constructor(private executableFactory: ExecutableFactory) {

  }

  public validateUserToken(username: string, token: string, complete: () => any) {
    return this.executableFactory.query({
      username: "admin", 
      name: "get-token"
    }).then((query: Query) => {
      return query.run({ token: token })
    }).then((results) => {
      if (token == process.env.CLUSTER_TOKEN || (results.length > 0 && username == results[0].username)) {
        return complete();
      }
      return "Unauthorized";
    })
  }

  public validateUserOwnsEnvironment(username: string, environment: string, complete: () => any) {
    return this.executableFactory.query({
      username: "admin", 
      name: "get-exe-by-type-name"
    }).then((query: Query) => {
      return query.run({username: username, exe: 'environment', name: environment})
    }).then((results) => {
      if (results.length > 0) {
        return complete()
      }
      return "Environment does not exist for user"
    })
  }

  public validateClusterToken(token: string, complete: () => any) {
    if (process.env.CLUSTER_TOKEN == token) {
      return complete()
    }
    return "Unauthorized"
  }

  public getReadPermission(type: string, name: string, token: string) {
    // Check for valid sessionToken
    // Check if session user has a read permission for an executable of type and name.
  }

  public getWritePermission(type: string, name: string, token: string) {
    // Check for valid sessionToken
    // Check if session user has a write permission for an executable of type and name.
    // If the user doesnt have write permission, but does have read permission, they
    // should be prompted to see if they want to save a new copy in their cluser.
    // They can never have write permission unless they have their own copy of it. Any edit
    // is saved to their own copy, which can be merged into the original if the owner wants it.
  }

  public getExecutePermission(type: string, name: string, token: string) {
    // Check for valid sessionToken
    // Check if session user has a execute permission for an executable of type and name.
    // In order to get execute access, a secret token must be granted to the user, that needs to be provided
    // on each request, unless the program is their own. Owners always have all permissions to
    // their executables.
  }
}
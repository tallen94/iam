import { Client } from "./Client";
import { AuthenticationClient } from "./AuthenticationClient";
import { UserClient } from "./UserClient";

export class ClientManager {

  constructor(
    private routerClient: Client,
    private authenticationClient: AuthenticationClient,
    private userClient: UserClient
  ) {

  }

  public addExecutable(data: any) {
    return this.routerClient.addExecutable(data)
  }

  public getExecutable(username: string, exe: string, name: string) {
    return this.routerClient.getExecutable(username, exe, name);
  }

  public getExecutables(username: string, exe: string) {
    return this.routerClient.getExecutables(username, exe);
  }

  public deleteExecutable(username: string, exe: string, name: string) {
    return this.routerClient.deleteExecutable(username, exe, name)
  }

  public runExecutable(username: string, exe: string, name: string, data: any, token: string) {
    return this.routerClient.runExecutable(username, exe, name, data, token);
  }

  public searchExecutables(searchText: string) {
    return this.routerClient.searchExecutables(searchText)
  }

  public addUser(username: string, email: string, password: string) {
    return this.userClient.addUser(username, email)
    .then((result: any) => {
      if (result.success) {
        return this.authenticationClient.addUserPassword(username, password)
      }
    })
  }

  public addUserSession(username: string, password: string) {
    return this.userClient.getUser(username)
    .then((result: any) => {
      if (!result.error) {
        return this.authenticationClient.addUserSession(username, password)
      }
      return { error: "not found"}
    })
  }

  public deleteUserSession(token: string) {
    return this.authenticationClient.deleteUserSession(token)
  }

  public validateUserSession(token: string) {
    return this.authenticationClient.validateUserSession(token)
  }

  public addUserToken(username: string) {
    return this.userClient.getUser(username)
    .then((result: any) => {
      if (!result.error) {
        return this.authenticationClient.addUserToken(username)
      }
      return { error: "not found" }
    })
  }

  public deleteUserToken(tokenId: string) {
    return this.authenticationClient.deleteUserToken(tokenId)
  } 
}
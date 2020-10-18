import { ClientCommunicator } from "../Communicator/ClientCommunicator";
import { ApiPaths } from "../Api/ApiPaths";

export class AuthenticationClient {

  constructor(
    private clientCommunicator: ClientCommunicator
  ) {}

  public addUserPassword(username: string, password: string) {
    return this.clientCommunicator.post(ApiPaths.ADD_USER_PASSWORD, {username: username, password: password})
  }

  public addUserSession(username: string, password: string) {
    return this.clientCommunicator.post(ApiPaths.ADD_USER_SESSION, {username: username, password: password})
  }

  public deleteUserSession(token: string) {
    return this.clientCommunicator.delete(ApiPaths.DELETE_USER_SESSION, {token: token})
  }

  public validateUserSession(token: string): Promise<any> {
    return this.clientCommunicator.post(ApiPaths.VALIDATE_USER_SESSION, {token: token})
  }

  public addUserToken(username: string, sessiontoken: string) {
    return this.clientCommunicator.post(ApiPaths.ADD_USER_TOKEN, {username: username}, {}, { sessiontoken: sessiontoken })
  }

  public getUserTokens(username: string, sessiontoken: string) {
    return this.clientCommunicator.get(ApiPaths.GET_USER_TOKENS, {username: username}, {}, {sessiontoken: sessiontoken})
  }

  public deleteUserToken(tokenId: string, sessiontoken: string) {
    return this.clientCommunicator.delete(ApiPaths.DELETE_USER_TOKEN, {tokenId: tokenId}, {}, { sessiontoken: sessiontoken })
  }

  public validateUserToken(tokenId: string, tokenSecret: string): Promise<any> {
    return this.clientCommunicator.post(ApiPaths.VALIDATE_USER_TOKEN, {tokenId: tokenId, tokenSecret: tokenSecret})
  }

  public validateAuthData(authData: any, username: string, fn: () => any) {
    if (authData.sessiontoken) {
      return this.validateUserSession(authData.sessiontoken)
      .then((result: any) => {
        if (result["username"] === username) {
          return fn()
        } else {
          return { error: "not permitted" }
        }
      })
    }

    if (authData.tokenid && authData.tokensecret) {
      return this.validateUserToken(authData.tokenid, authData.tokensecret)
      .then((result) => {
        if (result["username"] === username) {
          return fn()
        } else {
          return { error: "not permitted" }
        }
      })
    }
  }
}
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

  public addUserToken(username: string, sessionToken: string) {
    return this.clientCommunicator.post(ApiPaths.ADD_USER_TOKEN, {username: username}, {}, { sessiontoken: sessionToken })
  }

  public getUserTokens(username: string, sessionToken: string) {
    return this.clientCommunicator.get(ApiPaths.GET_USER_TOKENS, {username: username}, {}, {sessiontoken: sessionToken})
  }

  public deleteUserToken(tokenId: string, sessionToken: string) {
    return this.clientCommunicator.delete(ApiPaths.DELETE_USER_TOKEN, {tokenId: tokenId}, {}, { sessiontoken: sessionToken })
  }

  public validateUserToken(tokenId: string, tokenSecret: string): Promise<any> {
    return this.clientCommunicator.post(ApiPaths.VALIDATE_USER_TOKEN, {tokenId: tokenId, tokenSecret: tokenSecret})
  }
}
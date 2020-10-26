import { ClientCommunicator } from "../Communicator/ClientCommunicator";
import { ApiPaths } from "../Api/ApiPaths";
import { AuthData } from "../Auth/AuthData";

export class SecretClient {

  constructor(private clientCommunicator: ClientCommunicator) {

  }

  public addSecret(data: any, authData: AuthData) {
    return this.clientCommunicator.post(ApiPaths.ADD_SECRET, data, {}, authData.getHeaders())
  }

  public getSecret(name: string, username: string, authData: AuthData) {
    return this.clientCommunicator.get(ApiPaths.GET_SECRET, {name: name, username: username}, {}, authData.getHeaders())
  }

  public getSecretsForUser(username: string, authData: AuthData) {
    return this.clientCommunicator.get(ApiPaths.GET_SECRETS_FOR_USER, {username: username}, {}, authData.getHeaders())
  }

  public deleteSecret(name: string, username: string, authData: AuthData) {
    return this.clientCommunicator.delete(ApiPaths.DELETE_SECRET, {name: name, username: username}, {}, authData.getHeaders())
  }
}
import { ClientCommunicator } from "../Communicator/ClientCommunicator";
import { ApiPaths } from "../Api/ApiPaths";

export class SecretClient {

  constructor(private clientCommunicator: ClientCommunicator) {

  }

  public addSecret(data: any) {
    return this.clientCommunicator.post(ApiPaths.ADD_SECRET, data)
  }

  public getSecret(name: string, username: string) {
    return this.clientCommunicator.get(ApiPaths.GET_SECRET, {name: name, username: username})
  }

  public getSecretsForUser(username: string) {
    return this.clientCommunicator.get(ApiPaths.GET_SECRETS_FOR_USER, {username: username})
  }

  public deleteSecret(name: string, username: string) {
    return this.clientCommunicator.delete(ApiPaths.DELETE_SECRET, {name: name, username: username})
  }
}
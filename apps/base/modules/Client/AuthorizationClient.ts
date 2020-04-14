import { ClientCommunicator } from "../Communicator/ClientCommunicator";
import { ApiPaths } from "../Api/ApiPaths";

export class AuthorizationClient {

  constructor(
    private clientCommunicator: ClientCommunicator
  ) {}

  public getAuthorization(username: string, action: string, resource: string): Promise<any> {
    return this.clientCommunicator.post(ApiPaths.GET_AUTHORIZATION, {action: action, resource: resource, username: username})
  }

  public addAuthorization(requestor: string, username: string, action: string, resource: string): Promise<any> {
    return this.clientCommunicator.post(ApiPaths.ADD_AUTHORIZATION, {requestor: requestor, username: username, action: action, resource: resource})
  }
}
import { ClientCommunicator } from "../Communicator/ClientCommunicator";
import { ApiPaths } from "../Api/ApiPaths";

export class AuthorizationClient {

  constructor(
    private clientCommunicator: ClientCommunicator
  ) {}
  
  public addAuthorization(resource_from: string, resource_to: string, visibility: string) {
    return this.clientCommunicator.post(ApiPaths.ADD_AUTHORIZATION, {resource_from: resource_from, resource_to: resource_to, visibility: visibility})
  }

  public addAuthorizationPrivilege(resource_from: string, resource_to: string, privilege: string) {
    return this.clientCommunicator.post(ApiPaths.ADD_AUTHORIZATION_PRIVILEGE, {resource_from: resource_from, resource_to: resource_to, privilege: privilege})
  }

  public deleteAuthorizationPrivilege(resource_from: string, resource_to: string, privilege: string) {
    return this.clientCommunicator.delete(ApiPaths.DELETE_AUTHORIZATION_PRIVILEGE, {resource_from: resource_from, resource_to: resource_to, privilege: privilege})
  }

  public getAuthorization(resource_from: string, resource_to: string, privilege: string) {
    return this.clientCommunicator.get(ApiPaths.GET_AUTHORIZATION, {resource_from: resource_from, resource_to: resource_to, privilege: privilege})
  }

  public deleteAuthorization(resource_from: string, resource_to: string) {
    return this.clientCommunicator.delete(ApiPaths.DELETE_AUTHORIZATION, {resource_from: resource_from, resource_to: resource_to})
  }

  public getAuthorizationForResource(resource: string) {
    return this.clientCommunicator.get(ApiPaths.GET_AUTHORIZATION_FOR_RESOURCE, {resource: resource})
  }
}
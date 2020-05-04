import { DatabaseCommunicator } from "../Communicator/DatabaseCommunicator";
import { Queries } from "../Constants/Queries";

export class Authorization {

  // Permissions can require or not require a user to have a session token.
  // Read, Write, Execute
  //
  constructor(private databaseCommunicator: DatabaseCommunicator) {

  }

  public addAuthorizationVisibility(resource_from: string, resource_to: string, visibility: string) {
    return this.getAuthorizationVisibility(resource_from, resource_to)    
    .then((result: any[]) => {
      if (result.length === 0) {
        return this.databaseCommunicator.execute(Queries.ADD_AUTHORIZATION_VISIBILITY, {resource_from: resource_from, resource_to: resource_to, visibility: "none"})
      }
      return this.updateAuthorizationVisibility(resource_from, resource_to, visibility)
    })
  }

  public updateAuthorizationVisibility(resource_from: string, resource_to: string, visibility: string) {
    return this.databaseCommunicator.execute(Queries.UPDATE_AUTHORIZATION_VISIBILITY, {resource_from: resource_from, resource_to: resource_to, visibility: visibility})
  }

  public getAuthorizationVisibility(resource_from: string, resource_to: string) {
    return this.databaseCommunicator.execute(Queries.GET_AUTHORIZATION_VISIBILITY, {resource_from: resource_from, resource_to: resource_to})
  }

  public deleteAuthorizationVisibility(resource_from: string, resource_to: string) {
    return this.databaseCommunicator.execute(Queries.DELETE_AUTHORIZATION_VISIBILITY, {resource_from: resource_from, resource_to: resource_to, })
  }

  public getAuthorizationVisibilityForResource(resource: string) {
    return this.databaseCommunicator.execute(Queries.GET_AUTHORIZATION_VISIBILITY_FOR_RESOURCE, {resource: resource})
  }

  public addAuthorizationPrivilege(resource_from: string, resource_to: string, privilege: string) {
    return this.getAuthorizationPrivilege(resource_from, resource_to, privilege)
    .then((result: any[]) => {
      if (result.length === 0) {
        return this.databaseCommunicator.execute(Queries.ADD_AUTHORIZATION_PRIVILEGE, {resource_from: resource_from, resource_to: resource_to, privilege: privilege})
      }
    })
  }

  public getAuthorizationPrivilege(resource_from: string, resource_to: string, privilege: string) {
    return this.databaseCommunicator.execute(Queries.GET_AUTHORIZATION_PRIVILEGE, {resource_from: resource_from, resource_to: resource_to, privilege: privilege})
  }

  public deleteAuthorizationPrivilege(resource_from: string, resource_to: string, privilege: string) {
    return this.databaseCommunicator.execute(Queries.DELETE_AUTHORIZATION_PRIVILEGE, {resource_from: resource_from, resource_to: resource_to, privilege: privilege})
  }

  public deleteAllAuthorizationPrivilege(resource_from: string, resource_to: string) {
    return this.databaseCommunicator.execute(Queries.DELETE_ALL_AUTHORIZATION_PRIVILEGE, {resource_from: resource_from, resource_to: resource_to })
  }

  public getAllAuthorizationPrivilege(resource_from: string, resource_to: string) {
    return this.databaseCommunicator.execute(Queries.GET_ALL_AUTHORIZATION_PRIVILEGE, {resource_from: resource_from, resource_to: resource_to })
  }
}
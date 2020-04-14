import { DatabaseCommunicator } from "../Communicator/DatabaseCommunicator";
import { Queries } from "../Constants/Queries";

export class Authorization {

  // Permissions can require or not require a user to have a session token.
  // Read, Write, Execute
  //
  constructor(private databaseCommunicator: DatabaseCommunicator) {

  }

  public addAuthorization(username: string, rule: string) {
    return this.databaseCommunicator.execute(Queries.GET_AUTHORIZATION, {username: username, rule: rule})
    .then((result: any[]) => {
      if (result.length === undefined) {
        return this.databaseCommunicator.execute(Queries.ADD_AUTHORIZATION, {username: username, rule: rule})
      }
    })
  }

  public getAuthorization(username: string, rule) {
    return this.databaseCommunicator.execute(Queries.GET_AUTHORIZATION, {username: username, rule: rule})
    .then((result: any[]) => {
      if (result.length > 0) {
        return result[0]
      }
      return undefined
    })
  }
}
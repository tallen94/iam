import { DatabaseCommunicator } from "../Communicator/DatabaseCommunicator";
import { Queries } from "../Constants/Queries";

export class UserManager {

  constructor(private databaseCommunicator: DatabaseCommunicator) {

  } 

  public addUser(username: string, email: string) {
    return this.databaseCommunicator.execute(Queries.ADD_USER, {username: username, email: email})
    .then((result: any) => {
        return { success: result.affectedRows == 1 && result.warningCount == 0 }
    })
  }

  public getUser(username: string) {
    return this.databaseCommunicator.execute(Queries.GET_USER, {username: username})
    .then((result: any[]) => {
      if (result.length > 0) {
        return result[0]
      }
      return { error: "not found" }
    })
  }
}
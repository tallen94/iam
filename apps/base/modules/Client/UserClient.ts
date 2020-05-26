import { ClientCommunicator } from "../Communicator/ClientCommunicator";
import { ApiPaths } from "../Api/ApiPaths";

export class UserClient {
  constructor(private clientCommunicator: ClientCommunicator) {

  }

  public addUser(username: string, email: string) {
    return this.clientCommunicator.post(ApiPaths.ADD_USER, {username: username, email: email})
  }

  public getUser(username: string) {
    return this.clientCommunicator.get(ApiPaths.GET_USER, {username: username})
  }
}
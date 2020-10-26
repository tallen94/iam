import { ClientCommunicator } from "../Communicator/ClientCommunicator";
import { ApiPaths } from "../Api/ApiPaths";
import { AuthData } from "../Auth/AuthData";

export class ImageClient {

  constructor(private clientCommunicator: ClientCommunicator) {

  }

  public addImage(data: any, authData: AuthData) {
    return this.clientCommunicator.post(ApiPaths.ADD_IMAGE, data, {}, authData.getHeaders())
  }

  public getImage(username: string, name: string, authData: AuthData) {
    return this.clientCommunicator.get(ApiPaths.GET_IMAGE, {username: username, name: name}, {}, authData.getHeaders())
  }

  public getImageForUser(username: string, authData: AuthData) {
    return this.clientCommunicator.get(ApiPaths.GET_IMAGE_FOR_USER, {username: username}, {}, authData.getHeaders())
  }

  public deleteImage(username: string, name: string, authData: AuthData) {
    return this.clientCommunicator.delete(ApiPaths.DELETE_IMAGE, {username: username, name: name}, {}, authData.getHeaders())
  }

  public buildImage(username: string, name: string, authData: AuthData) {
    return this.clientCommunicator.post(ApiPaths.BUILD_IMAGE, {username: username, name: name}, {}, authData.getHeaders())
  }
}
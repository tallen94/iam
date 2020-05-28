import { ClientCommunicator } from "../Communicator/ClientCommunicator";
import { ApiPaths } from "../Api/ApiPaths";

export class ImageClient {

  constructor(private clientCommunicator: ClientCommunicator) {

  }

  public addImage(data: any) {
    return this.clientCommunicator.post(ApiPaths.ADD_IMAGE, data)
  }

  public getImage(username: string, name: string) {
    return this.clientCommunicator.get(ApiPaths.GET_IMAGE, {username: username, name: name})
  }

  public getImageForUser(username: string) {
    return this.clientCommunicator.get(ApiPaths.GET_IMAGE_FOR_USER, {username: username})
  }

  public deleteImage(username: string, name: string) {
    return this.clientCommunicator.delete(ApiPaths.DELETE_IMAGE, {username: username, name: name})
  }

  public buildImage(username: string, name: string) {
    return this.clientCommunicator.post(ApiPaths.BUILD_IMAGE, {username: username, name: name})
  }
}
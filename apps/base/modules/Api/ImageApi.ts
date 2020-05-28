import { ServerCommunicator } from "../Communicator/ServerCommunicator";
import { ApiPaths } from "./ApiPaths";
import { ImageManager } from "../Image/ImageManager";

export class ImageApi {

  constructor(
    private serverCommunicator: ServerCommunicator,
    private imageManager: ImageManager) {
    this.init();
  }

  private init(): void {

    this.serverCommunicator.post(ApiPaths.ADD_IMAGE, (req: any, res: any) => {
      this.imageManager.addImage(req.body)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_IMAGE, (req: any, res: any) => {
      this.imageManager.getImage(req.query.username, req.query.name)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_IMAGE_FOR_USER, (req: any, res: any) => {
      this.imageManager.getImages(req.query.username)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.delete(ApiPaths.DELETE_IMAGE, (req: any, res: any) => {
      this.imageManager.deleteImage(req.query.username, req.query.name)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.post(ApiPaths.BUILD_IMAGE, (req: any, res: any) => {
      this.imageManager.buildImage(req.body.username, req.body.name)
      .then((result) => {
        res.status(200).send(result)
      })
    })
  }
}
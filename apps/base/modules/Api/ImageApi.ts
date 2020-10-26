import { ServerCommunicator } from "../Communicator/ServerCommunicator";
import { ApiPaths } from "./ApiPaths";
import { ImageManager } from "../Image/ImageManager";
import { AuthData } from "../Auth/AuthData";
import { AuthenticationClient } from "../Client/AuthenticationClient";

export class ImageApi {

  constructor(
    private serverCommunicator: ServerCommunicator,
    private imageManager: ImageManager,
    private authenticationClient: AuthenticationClient) {
    this.init();
  }

  private init(): void {

    this.serverCommunicator.post(ApiPaths.ADD_IMAGE, (req: any, res: any) => {
      const username = req.body.username
      const authData = AuthData.fromHeaders(req.headers)
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.imageManager.addImage(req.body)
        .then((result) => {
          res.status(200).send(result)
        })
      }, (error: any) => {
        res.status(400).send(error)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_IMAGE, (req: any, res: any) => {
      const authData = AuthData.fromHeaders(req.headers)
      const username = req.query.username
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.imageManager.getImage(req.query.username, req.query.name)
        .then((result) => {
          res.status(200).send(result)
        })
      }, (error: any) => {
        res.status(400).send(error)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_IMAGE_FOR_USER, (req: any, res: any) => {
      const username = req.query.username
      const authData = AuthData.fromHeaders(req.headers)
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.imageManager.getImages(req.query.username)
        .then((result) => {
          res.status(200).send(result)
        })
      }, (error: any) => {
        res.status(400).send(error)
      })
    })

    this.serverCommunicator.delete(ApiPaths.DELETE_IMAGE, (req: any, res: any) => {
      const username = req.query.username
      const authData = AuthData.fromHeaders(req.headers)
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.imageManager.deleteImage(req.query.username, req.query.name)
        .then((result) => {
          res.status(200).send(result)
        })
      }, (error: any) => {
        res.status(400).send(error)
      })
    })

    this.serverCommunicator.post(ApiPaths.BUILD_IMAGE, (req: any, res: any) => {
      const username = req.body.username
      const authData = AuthData.fromHeaders(req.headers)
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.imageManager.buildImage(req.body.username, req.body.name)
        .then((result) => {
          res.status(200).send(result)
        })
      }, (error: any) => {
        res.status(400).send(error)
      })
    })
  }
}
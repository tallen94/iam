import { ServerCommunicator } from "../Communicator/ServerCommunicator";
import { ApiPaths } from "./ApiPaths";
import { Authentication } from "../Auth/Authentication";

export class AuthenticationApi {

  constructor(
    private serverCommunicator: ServerCommunicator,
    private authentication: Authentication) {
    this.init();
  }

  private init(): void {

    this.serverCommunicator.post(ApiPaths.ADD_USER_PASSWORD, (req: any, res: any) => {
      this.authentication.addUserPassword(req.body.username, req.body.password)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.post(ApiPaths.ADD_USER_SESSION, (req: any, res: any) => {
      this.authentication.addUserSession(req.body.username, req.body.password)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.delete(ApiPaths.DELETE_USER_SESSION, (req: any, res: any) => {
      this.authentication.deleteUserSession(req.query.token)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.post(ApiPaths.VALIDATE_USER_SESSION, (req: any, res: any) => {
      this.authentication.validateUserSession(req.body.token)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.post(ApiPaths.ADD_USER_TOKEN, (req: any, res: any) => {
      this.authentication.addUserToken(req.body.username)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.delete(ApiPaths.DELETE_USER_TOKEN, (req: any, res: any) => {
      this.authentication.deleteUserToken(req.query.tokenId)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.post(ApiPaths.VALIDATE_USER_TOKEN, (req: any, res: any) => {
      this.authentication.validateUserToken(req.body.tokenId, req.body.tokenSecret)
      .then((result) => {
        res.status(200).send({isValid: result})
      })
    })
  }
}
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

    /**
     * Create a user token for the current logged in user
     */
    this.serverCommunicator.post(ApiPaths.ADD_USER_TOKEN, (req: any, res: any) => {
      this.authentication.validateUserSession(req.headers.sessiontoken)
      .then((result) => {
        if (!result.error && result.username === req.body.username) {
          this.authentication.addUserToken(req.body.username)
          .then((result) => {
            res.status(200).send(result)
          })
        } else {
          res.status(401).send({ error: "unauthorized" })
        }
      })
    })

    /**
     * Get all user tokens for current logged in user
     */
    this.serverCommunicator.get(ApiPaths.GET_USER_TOKENS, (req: any, res: any) => {
      this.authentication.validateUserSession(req.headers.sessiontoken)
      .then((result) => {
        if (!result.error && result.username === req.query.username) {
          this.authentication.getUserTokens(req.query.username)
          .then((result) => {
            res.status(200).send(result)
          })
        } else {
          res.status(401).send({ error: "unauthorized" })
        }
      })
    })

    /**
     * Delete user token for current logged in user
     */
    this.serverCommunicator.delete(ApiPaths.DELETE_USER_TOKEN, (req: any, res: any) => {
      Promise.all([
        this.authentication.validateUserSession(req.headers.sessiontoken),
        this.authentication.getUserToken(req.query.tokenId)
      ]).then((results: any[]) => {
        const session = results[0]
        const token = results[1]
        if (!session.error && !token.error && token.username == session.username) {
          this.authentication.deleteUserToken(req.query.tokenId)
          .then((result) => {
            res.status(200).send(result)
          })
        } else {
          res.status(401).send({ error: "unauthorized" })
        }
      })
    })

    this.serverCommunicator.post(ApiPaths.VALIDATE_USER_TOKEN, (req: any, res: any) => {
      this.authentication.validateUserToken(req.body.tokenId, req.body.tokenSecret)
      .then((result) => {
        res.status(200).send(result)
      })
    })
  }
}
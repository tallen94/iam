import { ServerCommunicator } from "../Communicator/ServerCommunicator";
import { SecretManager } from "../Secret/SecretManager";
import { ApiPaths } from "./ApiPaths";
import { AuthenticationClient } from "../Client/AuthenticationClient";
import { AuthData } from "../Auth/AuthData";

export class SecretApi {

  constructor(
    private serverCommunicator: ServerCommunicator,
    private secretManager: SecretManager,
    private authenticationClient: AuthenticationClient) {
      this.init()
  }

  private init() {

    this.serverCommunicator.post(ApiPaths.ADD_SECRET, (req: any, res: any) => {
      const data = req.body
      const username = data.username
      const authData = AuthData.fromHeaders(req.headers)
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.secretManager.addSecret(data)
        .then((result) => {
          res.status(200).send(result)
        })
      }, (error: any) => {
        res.status(400).send(error)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_SECRET, (req: any, res: any) => {
      const name = req.query.name
      const username = req.query.username
      const authData = AuthData.fromHeaders(req.headers)
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.secretManager.getSecret(name, username)
        .then((result) => {
          res.status(200).send(result)
        })
      }, (error: any) => {
        res.status(400).send(error)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_SECRETS_FOR_USER, (req: any, res: any) => {
      const username = req.query.username
      const authData = AuthData.fromHeaders(req.headers)
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.secretManager.getSecretsForUser(username)
        .then((result) => {
          res.status(200).send(result)
        })
      }, (error: any) => {
        res.status(400).send(error)
      })
    })

    this.serverCommunicator.delete(ApiPaths.DELETE_SECRET, (req: any, res: any) => {
      const name = req.query.name
      const username = req.query.username
      const authData = AuthData.fromHeaders(req.headers)
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.secretManager.deleteSecret(name, username)
        .then((result) => {
          res.status(200).send(result)
        })
      }, (error: any) => {
        res.status(400).send(error)
      })
    })
  }

}
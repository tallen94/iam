import { ServerCommunicator } from "../Communicator/ServerCommunicator";
import { SecretManager } from "../Secret/SecretManager";
import { ApiPaths } from "./ApiPaths";

export class SecretApi {

  constructor(
    private serverCommunicator: ServerCommunicator,
    private secretManager: SecretManager) {
      this.init()
  }

  private init() {

    this.serverCommunicator.post(ApiPaths.ADD_SECRET, (req: any, res: any) => {
      const data = req.body
      this.secretManager.addSecret(data)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_SECRET, (req: any, res: any) => {
      const name = req.query.name
      const username = req.query.username
      this.secretManager.getSecret(name, username)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_SECRETS_FOR_USER, (req: any, res: any) => {
      const username = req.query.username
      this.secretManager.getSecretsForUser(username)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.delete(ApiPaths.DELETE_SECRET, (req: any, res: any) => {
      const name = req.query.name
      const username = req.query.username
      this.secretManager.deleteSecret(name, username)
      .then((result) => {
        res.status(200).send(result)
      })
    })
  }

}
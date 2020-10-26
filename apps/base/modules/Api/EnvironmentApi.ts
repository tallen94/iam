import { ServerCommunicator } from "../Communicator/ServerCommunicator";
import { EnvironmentManager } from "../Environment/EnvironmentManager";
import { ApiPaths } from "./ApiPaths";
import { AuthenticationClient } from "../Client/AuthenticationClient";
import { AuthData } from "../Auth/AuthData";

export class EnvironmentApi {

  constructor(
    private serverCommunicator: ServerCommunicator,
    private environmentManager: EnvironmentManager,
    private authenticationClient: AuthenticationClient) {
    this.init();
  }

  private init(): void {

    this.serverCommunicator.post(ApiPaths.ADD_ENVIRONMENT, (req: any, res: any) => {
      const authData = AuthData.fromHeaders(req.headers)
      const username = req.body.username
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.environmentManager.addEnvironment(req.body)
        .then((result) => {
          res.status(200).send(result)
        })
      }, (error: any) => {
        res.status(400).send(error)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_ENVIRONMENT, (req: any, res: any) => {
      const authData = AuthData.fromHeaders(req.headers)
      const username = req.query.username
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.environmentManager.getEnvironment(username, req.query.name, req.query.cluster)
        .then((result) => {
          res.status(200).send(result)
        })
      }, (error: any) => {
        res.status(400).send(error)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_ENVIRONMENT_FOR_USER, (req: any, res: any) => {
      const authData = AuthData.fromHeaders(req.headers)
      const username = req.query.username
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.environmentManager.getEnvironmentForUser(username)
        .then((result) => {
          res.status(200).send(result)
        })
      }, (error: any) => {
        res.status(400).send(error)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_ENVIRONMENT_FOR_CLUSTER, (req: any, res: any) => {
      const authData = AuthData.fromHeaders(req.headers)
      const username = req.query.username
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.environmentManager.getEnvironmentsForCluster(req.query.cluster, username)
        .then((result) => {
          res.status(200).send(result)
        })
      }, (error: any) => {
        res.status(400).send(error)
      })
    })

    this.serverCommunicator.delete(ApiPaths.DELETE_ENVIRONMENT, (req: any, res: any) => {
      const authData = AuthData.fromHeaders(req.headers)
      const username = req.query.username
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.environmentManager.deleteEnvironment(username, req.query.name, req.query.cluster)
        .then((result) => {
          res.status(200).send(result)
        })
      }, (error: any) => {
        res.status(400).send(error)
      })
    })

    this.serverCommunicator.post(ApiPaths.START_ENVIRONMENT, (req: any, res: any) => {
      const authData = AuthData.fromHeaders(req.headers)
      const username = req.body.username
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.environmentManager.startEnvironment(username, req.body.name, req.body.cluster)
        .then((result) => {
          res.status(200).send(result)
        })
      }, (error: any) => {
        res.status(400).send(error)
      })
    })

    this.serverCommunicator.post(ApiPaths.STOP_ENVIRONMENT, (req: any, res: any) => {
      const authData = AuthData.fromHeaders(req.headers)
      const username = req.body.username
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.environmentManager.stopEnvironment(username, req.body.name, req.body.cluster)
        .then((result) => {
          res.status(200).send(result)
        })
      }, (error: any) => {
        res.status(400).send(error)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_ENDPOINTS, (req: any, res: any) => {
      const authData = AuthData.fromHeaders(req.headers)
      const username = req.query.username
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.environmentManager.getEndpoints(username, req.query.name, req.query.cluster)
        .then((result) => {
          res.status(200).send(result)
        })
      }, (error: any) => {
        res.status(400).send(error)
      })
    })
  }
}
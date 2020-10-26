import { ServerCommunicator } from "../Communicator/ServerCommunicator";
import { ApiPaths } from "./ApiPaths";
import { DataManager } from "../Data/DataManager";
import { AuthenticationClient } from "../Client/AuthenticationClient";
import { AuthData } from "../Auth/AuthData";

export class DataApi {

  constructor(
    private serverCommunicator: ServerCommunicator,
    private dataManager: DataManager,
    private authenticationClient: AuthenticationClient) {
    this.init();
  }

  private init(): void {

    this.serverCommunicator.post(ApiPaths.ADD_DATASET, (req: any, res: any) => {
      const username = req.body.username
      const authData = AuthData.fromHeaders(req.headers)
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.dataManager.addDataset(req.body)
        .then((result) => {
          res.status(200).send(result)
        })
      }, (error: any) => {
        res.status(400).send(error)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_DATASET, (req: any, res: any) => {
      const username = req.query.username
      const authData = AuthData.fromHeaders(req.headers)
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.dataManager.getDataset(username, req.query.cluster, req.query.environment, req.query.name)
        .then((result) => {
          res.status(200).send(result)
        })
      }, (error: any) => {
        res.status(400).send(error)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_DATASET_FOR_USER, (req: any, res: any) => {
      const username = req.query.username
      const authData = AuthData.fromHeaders(req.headers)
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.dataManager.getDatasetForUser(username)
        .then((result) => {
          res.status(200).send(result)
        })
      }, (error: any) => {
        res.status(400).send(error)
      })
    })

    this.serverCommunicator.post(ApiPaths.LOAD_DATASET, (req: any, res: any) => {
      const username = req.body.username
      const authData = AuthData.fromHeaders(req.headers)
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.dataManager.loadDataset(username, req.body.cluster, req.body.environment, req.body.name, req.body.executableData)
        .then((result) => {
          res.status(200).send(result)
        })
      }, (error: any) => {
        res.status(400).send(error)
      })
    })

    this.serverCommunicator.post(ApiPaths.TRANSFORM_DATASET, (req: any, res: any) => {
      const username = req.body.username
      const authData = AuthData.fromHeaders(req.headers)
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.dataManager.transformData(username, req.body.cluster, req.body.environment, req.body.name, req.body.functionData, authData)
        .then((result) => {
          res.status(200).send(result)
        })
      }, (error: any) => {
        res.status(400).send(error)
      })
    })

    this.serverCommunicator.get(ApiPaths.READ_DATASET, (req: any, res: any) => {
      const username = req.query.username
      const authData = AuthData.fromHeaders(req.headers)
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.dataManager.readDataset(username, req.query.cluster, req.query.environment, req.query.name, req.query.tag, req.query.limit, authData)
        .then((result) => {
          res.status(200).send(result)
        })
      }, (error: any) => {
        res.status(400).send(error)
      })
    })

    this.serverCommunicator.delete(ApiPaths.DELETE_DATASET_TAG, (req: any, res: any) => {
      const username = req.query.username
      const authData = AuthData.fromHeaders(req.headers)
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.dataManager.deleteDatasetTag(username, req.query.cluster, req.query.environment, req.query.name, req.query.tag, authData)
        .then((result) => {
          res.status(200).send(result)
        })
      }, (error: any) => {
        res.status(400).send(error)
      })
    })
  }
}
import { ServerCommunicator } from "../Communicator/ServerCommunicator";
import { ApiPaths } from "./ApiPaths";
import { ClusterManager } from "../Cluster/ClusterManager";
import { AuthenticationClient } from "../Client/AuthenticationClient";
import { AuthData } from "../Auth/AuthData";

export class ClusterApi {

  constructor(
    private serverCommunicator: ServerCommunicator,
    private clusterManager: ClusterManager,
    private authenticationClient: AuthenticationClient) {
    this.init();
  }

  private init(): void {

    this.serverCommunicator.post(ApiPaths.ADD_CLUSTER, (req: any, res: any) => {
      const authData = AuthData.fromHeaders(req.headers)
      const username = req.body.username
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.clusterManager.addCluster(req.body)
        .then((result) => {
          res.status(200).send(result)
        })
      }, (error: any) => {
        res.status(400).send(error)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_CLUSTER, (req: any, res: any) => {
      const authData = AuthData.fromHeaders(req.headers)
      const username = req.query.username
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.clusterManager.getCluster(username, req.query.name)
        .then((result) => {
          res.status(200).send(result)
        })
      }, (error: any) => {
        res.status(400).send(error)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_CLUSTER_FOR_USER, (req: any, res: any) => {
      const authData = AuthData.fromHeaders(req.headers)
      const username = req.query.username
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.clusterManager.getClusterForUser(username)
        .then((result) => {
          res.status(200).send(result)
        })
      }, (error: any) => {
        res.status(400).send(error)
      })
    })

    this.serverCommunicator.delete(ApiPaths.DELETE_CLUSTER, (req: any, res: any) => {
      const authData = AuthData.fromHeaders(req.headers)
      const username = req.query.username
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.clusterManager.deleteCluster(username, req.query.name)
        .then((result) => {
          res.status(200).send(result)
        })
      }, (error: any) => {
        res.status(400).send(error)
      })
    })
  }
}
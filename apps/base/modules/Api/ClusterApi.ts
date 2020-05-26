import { ServerCommunicator } from "../Communicator/ServerCommunicator";
import { ApiPaths } from "./ApiPaths";
import { ClusterManager } from "../Cluster/ClusterManager";

export class ClusterApi {

  constructor(
    private serverCommunicator: ServerCommunicator,
    private clusterManager: ClusterManager) {
    this.init();
  }

  private init(): void {

    this.serverCommunicator.post(ApiPaths.ADD_CLUSTER, (req: any, res: any) => {
      this.clusterManager.addCluster(req.body)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_CLUSTER, (req: any, res: any) => {
      this.clusterManager.getCluster(req.query.username, req.query.name)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_CLUSTER_FOR_USER, (req: any, res: any) => {
      this.clusterManager.getClusterForUser(req.query.username)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.delete(ApiPaths.DELETE_CLUSTER, (req: any, res: any) => {
      this.clusterManager.deleteCluster(req.query.username, req.query.name)
      .then((result) => {
        res.status(200).send(result)
      })
    })
  }
}
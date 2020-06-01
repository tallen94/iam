import { ServerCommunicator } from "../Communicator/ServerCommunicator";
import { ApiPaths } from "./ApiPaths";
import { DataManager } from "../Data/DataManager";

export class DataApi {

  constructor(
    private serverCommunicator: ServerCommunicator,
    private dataManager: DataManager) {
    this.init();
  }

  private init(): void {

    this.serverCommunicator.post(ApiPaths.ADD_DATASET, (req: any, res: any) => {
      this.dataManager.addDataset(req.body)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_DATASET, (req: any, res: any) => {
      this.dataManager.getDataset(req.query.username, req.query.cluster, req.query.environment, req.query.name)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_DATASET_FOR_USER, (req: any, res: any) => {
      this.dataManager.getDatasetForUser(req.query.username)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.post(ApiPaths.LOAD_DATASET, (req: any, res: any) => {
      this.dataManager.loadDataset(req.body.username, req.body.cluster, req.body.environment, req.body.name, req.body.queryData)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.post(ApiPaths.TRANSFORM_DATASET, (req: any, res: any) => {
      this.dataManager.transformData(req.body.username, req.body.cluster, req.body.environment, req.body.name, req.body.functionData)
      .then((result) => {
        res.status(200).send(result)
      })
    })
  }
}
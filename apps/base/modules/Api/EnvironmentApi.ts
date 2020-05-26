import { ServerCommunicator } from "../Communicator/ServerCommunicator";
import { EnvironmentManager } from "../Environment/EnvironmentManager";
import { ApiPaths } from "./ApiPaths";

export class EnvironmentApi {

  constructor(
    private serverCommunicator: ServerCommunicator,
    private environmentManager: EnvironmentManager) {
    this.init();
  }

  private init(): void {

    this.serverCommunicator.post(ApiPaths.ADD_ENVIRONMENT, (req: any, res: any) => {
      this.environmentManager.addEnvironment(req.body)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_ENVIRONMENT, (req: any, res: any) => {
      this.environmentManager.getEnvironment(req.query.username, req.query.name, req.query.cluster)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_ENVIRONMENT_FOR_USER, (req: any, res: any) => {
      this.environmentManager.getEnvironmentForUser(req.query.username)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_ENVIRONMENT_FOR_CLUSTER, (req: any, res: any) => {
      this.environmentManager.getEnvironmentsForCluster(req.query.cluster, req.query.username)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.delete(ApiPaths.DELETE_ENVIRONMENT, (req: any, res: any) => {
      this.environmentManager.deleteEnvironment(req.query.username, req.query.name, req.query.cluster)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.post(ApiPaths.BUILD_IMAGE, (req: any, res: any) => {
      this.environmentManager.buildImage(req.body.username, req.body.name, req.body.cluster)
      .then((result) => {
        res.status(200).send(result)
      })
    })


    this.serverCommunicator.post(ApiPaths.START_ENVIRONMENT, (req: any, res: any) => {
      this.environmentManager.startEnvironment(req.body.username, req.body.name, req.body.cluster)
      .then((result) => {
        res.status(200).send(result)
      })
    })


    this.serverCommunicator.post(ApiPaths.STOP_ENVIRONMENT, (req: any, res: any) => {
      this.environmentManager.stopEnvironment(req.body.username, req.body.name, req.body.cluster)
      .then((result) => {
        res.status(200).send(result)
      })
    })
  }
}
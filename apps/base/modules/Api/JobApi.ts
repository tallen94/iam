import { ServerCommunicator } from "../Communicator/ServerCommunicator";
import { JobManager } from "../Job/JobManager";
import { ApiPaths } from "./ApiPaths";

export class JobApi {

  constructor(
    private serverCommunicator: ServerCommunicator,
    private jobManager: JobManager) {
    this.init();
  }

  private init(): void {

    this.serverCommunicator.post(ApiPaths.ADD_JOB, (req: any, res: any) => {
      this.jobManager.addJob(req.body)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_JOB, (req: any, res: any) => {
      this.jobManager.getJob(req.query.username, req.query.name)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_JOBS_FOR_USER, (req: any, res: any) => {
      this.jobManager.getJobsForUser(req.query.username)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.delete(ApiPaths.DELETE_JOB, (req: any, res: any) => {
      this.jobManager.deleteJob(req.query.username, req.query.name)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.post(ApiPaths.ENABLE_JOB, (req: any, res: any) => {
      this.jobManager.enableJob(req.body.username, req.body.name)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.post(ApiPaths.DISABLE_JOB, (req: any, res: any) => {
      this.jobManager.disableJob(req.body.username, req.body.name)
      .then((result) => {
        res.status(200).send(result)
      })
    })
  }
}
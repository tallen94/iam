import { ServerCommunicator } from "../Communicator/ServerCommunicator";
import { JobManager } from "../Job/JobManager";
import { ApiPaths } from "./ApiPaths";
import { AuthenticationClient } from "../Client/AuthenticationClient";
import { AuthData } from "../Auth/AuthData";

export class JobApi {

  constructor(
    private serverCommunicator: ServerCommunicator,
    private jobManager: JobManager,
    private authenticationClient: AuthenticationClient) {
    this.init();
  }

  private init(): void {

    this.serverCommunicator.post(ApiPaths.ADD_JOB, (req: any, res: any) => {
      const username = req.body.username
      const authData = AuthData.fromHeaders(req.headers)
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.jobManager.addJob(req.body)
        .then((result) => {
          res.status(200).send(result)
        })
      }, (error: any) => {
        res.status(400).send(error)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_JOB, (req: any, res: any) => {
      const username = req.query.username
      const authData = AuthData.fromHeaders(req.headers)
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.jobManager.getJob(req.query.username, req.query.name)
        .then((result) => {
          res.status(200).send(result)
        })
      }, (error: any) => {
        res.status(400).send(error)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_JOBS_FOR_USER, (req: any, res: any) => {
      const username = req.query.username
      const authData = AuthData.fromHeaders(req.headers)
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.jobManager.getJobsForUser(req.query.username)
        .then((result) => {
          res.status(200).send(result)
        })
      }, (error: any) => {
        res.status(400).send(error)
      })
    })

    this.serverCommunicator.delete(ApiPaths.DELETE_JOB, (req: any, res: any) => {
      const username = req.query.username
      const authData = AuthData.fromHeaders(req.headers)
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.jobManager.deleteJob(req.query.username, req.query.name)
        .then((result) => {
          res.status(200).send(result)
        })
      }, (error: any) => {
        res.status(400).send(error)
      })
    })

    this.serverCommunicator.post(ApiPaths.ENABLE_JOB, (req: any, res: any) => {
      const username = req.body.username
      const authData = AuthData.fromHeaders(req.headers)
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.jobManager.enableJob(req.body.username, req.body.name)
        .then((result) => {
          res.status(200).send(result)
        })
      }, (error: any) => {
        res.status(400).send(error)
      })
    })

    this.serverCommunicator.post(ApiPaths.DISABLE_JOB, (req: any, res: any) => {
      const username = req.body.username
      const authData = AuthData.fromHeaders(req.headers)
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.jobManager.disableJob(req.body.username, req.body.name)
        .then((result) => {
          res.status(200).send(result)
        })
      }, (error: any) => {
        res.status(400).send(error)
      })
    })
  }
}
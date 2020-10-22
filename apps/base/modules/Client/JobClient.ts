import { ClientCommunicator } from "../Communicator/ClientCommunicator";
import { ApiPaths } from "../Api/ApiPaths";

export class JobClient {

  constructor(private clientCommunicator: ClientCommunicator) {

  }

  public addJob(data: any) {
    return this.clientCommunicator.post(ApiPaths.ADD_JOB, data)
  }

  public getJob(username: string, name: string) {
    return this.clientCommunicator.get(ApiPaths.GET_JOB, {username: username, name: name})
  }

  public getJobsForUser(username: string) {
    return this.clientCommunicator.get(ApiPaths.GET_JOBS_FOR_USER, {username: username})
  }

  public deleteJob(username: string, name: string) {
    return this.clientCommunicator.delete(ApiPaths.DELETE_JOB, {username: username, name: name})
  }

  public enableJob(username: string, name: string) {
    return this.clientCommunicator.post(ApiPaths.ENABLE_JOB, {username: username, name: name})
  }

  public disableJob(username: string, name: string) {
    return this.clientCommunicator.post(ApiPaths.DISABLE_JOB, {username: username, name: name})
  }
}

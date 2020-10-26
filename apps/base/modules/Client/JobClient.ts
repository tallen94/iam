import { ClientCommunicator } from "../Communicator/ClientCommunicator";
import { ApiPaths } from "../Api/ApiPaths";
import { AuthData } from "../Auth/AuthData";

export class JobClient {

  constructor(private clientCommunicator: ClientCommunicator) {

  }

  public addJob(data: any, authData: AuthData) {
    return this.clientCommunicator.post(ApiPaths.ADD_JOB, data, {}, authData.getHeaders())
  }

  public getJob(username: string, name: string, authData: AuthData) {
    return this.clientCommunicator.get(ApiPaths.GET_JOB, {username: username, name: name}, {}, authData.getHeaders())
  }

  public getJobsForUser(username: string, authData: AuthData) {
    return this.clientCommunicator.get(ApiPaths.GET_JOBS_FOR_USER, {username: username}, {}, authData.getHeaders())
  }

  public deleteJob(username: string, name: string, authData: AuthData) {
    return this.clientCommunicator.delete(ApiPaths.DELETE_JOB, {username: username, name: name}, {}, authData.getHeaders())
  }

  public enableJob(username: string, name: string, authData: AuthData) {
    return this.clientCommunicator.post(ApiPaths.ENABLE_JOB, {username: username, name: name}, {}, authData.getHeaders())
  }

  public disableJob(username: string, name: string, authData: AuthData) {
    return this.clientCommunicator.post(ApiPaths.DISABLE_JOB, {username: username, name: name}, {}, authData.getHeaders())
  }
}

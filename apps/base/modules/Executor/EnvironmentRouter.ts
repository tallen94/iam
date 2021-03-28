import { ClientCommunicator } from "../Communicator/ClientCommunicator";
import { ExecutorClient } from "../Client/ExecutorClient";
import { DatabaseCommunicator } from "../Communicator/DatabaseCommunicator";
import { FileSystemCommunicator } from "../Communicator/FileSystemCommunicator";
import * as Lodash from "lodash";
import { Queries } from "../Constants/Queries";
import { ExecutableAccessor } from "./ExecutableAccessor";
import { AuthData } from "../Auth/AuthData";
import uuid from "uuid";

export class EnvironmentRouter {

  constructor(
    private databaseCommunicator: DatabaseCommunicator,
    private executableAccessor: ExecutableAccessor, 
    private fileSystemCommunicator: FileSystemCommunicator
  ) {}

  public addExecutable(data: any) {
    return this.getRoute(data.username, data.cluster, data.environment, data.name, data.exe)
    .then((result: any[]) => {
      if (result.length == 0) {
        const route = [data.username, data.cluster, data.environment].join("-")
        return this.addRoute(data.username, data.cluster, data.environment, data.name, data.exe, route)
      }
    }).then(() => {
      return this.executableAccessor.addExecutable(data);
    })
  }
 
  public getExecutable(username: string, cluster: string, environment: string, name: string, exe: string) {
    return this.getRoute(username, cluster, environment, name, exe)
    .then((results: any[]) => {
      if (results.length > 0) {
        const route = results[0]
        return this.executableAccessor.getExecutable(username, cluster, environment, name, exe);
      }
    })
  }

  public getExecutables(username: string, exe: string) {
    return this.getUserRoutes(username, exe)
    .then((results: any[]) => {
      return Promise.all(Lodash.map(results, (route) => {
        return this.executableAccessor.getExecutable(route.username, route.cluster, route.environment, route.name, route.exe);
      }))
    })
  }

  public deleteExecutable(username: string, cluster: string, environment: string, exe: string, name: string) {
    return this.getRoute(username, cluster, environment, name, exe)
    .then((results: any[]) => {
      if (results.length > 0) {
        const route = results[0]
        return this.executableAccessor.deleteExecutable(route.username, route.cluster, route.environment, route.exe, route.name)
        .then(() => {
          return this.deleteRoute(route.username, route.cluster, route.environment, route.exe, route.name)
        });
      }
    })
  }

  public runExecutable(exe: string, username: string, cluster: string, environment: string, name: string, data: any, authData: AuthData) {
    return this.getRoute(username, cluster, environment, name, exe)
    .then((results: any[]) => {
      if (results.length > 0) {
        const route = results[0]
        const host = route.route
        const clientCommunicator: ClientCommunicator = new ClientCommunicator(host, 80)
        const client: ExecutorClient = new ExecutorClient(clientCommunicator);
        return this.trackJob(username, cluster, environment, exe, name, () => {
          return client.runExecutable(username, cluster, environment, exe, name, data, authData);
        })
      }
    })
  }

  private trackJob(username, cluster, environment, exe, name, job: () => Promise<any>) {
    const job_uid = uuid.v4()
    return this.databaseCommunicator.execute(Queries.ADD_JOB_RUN, {
      username: username,
      cluster: cluster,
      environment: environment,
      exe: exe,
      name: name,
      uid: job_uid,
      status: "RUNNING",
      createdOn: Date.now(),
      updatedOn: Date.now()
    }).then(() => {
      return job()
    }).then((result) => {
      return Promise.all([
        this.databaseCommunicator.execute(Queries.UPDATE_JOB_RUN, {
          uid: job_uid,
          status: "COMPLETE",
          updatedOn: Date.now()
        }),
        this.fileSystemCommunicator.putFile([username, cluster, environment, exe, name].join("/"), {
          name: job_uid,
          file: result
        })
      ]).then(() => {
        return result
      })
    })
  }

  private addRoute(username: string, cluster: string, environment: string, name: string, exe: string, route: string) {
    return this.databaseCommunicator.execute(Queries.ADD_ROUTE, {username: username, cluster: cluster, environment: environment, name: name, exe: exe, route: route})
  }

  private getRoute(username: string, cluster: string, environment: string, name: string, exe: string) {
    return this.databaseCommunicator.execute(Queries.GET_ROUTE, {username: username, cluster: cluster, environment: environment, name: name, exe: exe})
  }

  private getUserRoutes(username: string, exe: string) {
    return this.databaseCommunicator.execute(Queries.GET_ROUTES_FOR_USER, {username: username, exe: exe})
  }

  private deleteRoute(username: string, cluster: string, environment: string, exe: string, name: string) {
    return this.databaseCommunicator.execute(Queries.DELETE_ROUTE, {username: username, cluster: cluster, environment: environment, exe: exe, name: name})
  }

  public searchExecutables(searchText) {
    return this.databaseCommunicator.execute(Queries.SEARCH_ROUTES, {searchText: searchText})
  }
}
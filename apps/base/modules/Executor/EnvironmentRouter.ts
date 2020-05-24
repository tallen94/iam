import { ClientCommunicator } from "../Communicator/ClientCommunicator";
import { Client } from "../Client/Client";
import { DatabaseCommunicator } from "../Communicator/DatabaseCommunicator";
import * as Lodash from "lodash";
import { Queries } from "../Constants/Queries";
import { Executor } from "./Executor";

export class EnvironmentRouter {

  constructor(
    private databaseCommunicator: DatabaseCommunicator,
    private executor: Executor
  ) {}

  public addExecutable(data: any) {
    return this.getRoute(data.username, data.name, data.exe)
    .then((result: any[]) => {
      if (result.length == 0) {
        return this.addRoute(data.username, data.name, data.exe, data.environment)
      }
    }).then(() => {
      return this.executor.addExecutable(data);
    })
  }
 
  public getExecutable(username: string, name: string, exe: string) {
    return this.getRoute(username, name, exe)
    .then((results: any[]) => {
      if (results.length > 0) {
        const route = results[0]
        return this.executor.getExecutable(route.username, route.name, route.exe);
      }
    })
  }

  public getExecutables(username: string, exe: string) {
    return this.getUserRoutes(username, exe)
    .then((results: any[]) => {
      return Promise.all(Lodash.map(results, (route) => {
        return this.executor.getExecutable(route.username, route.name, route.exe);
      }))
    })
  }

  public getExecutablesForEnvironment(username: string, exe: string, environment: string) {
    return this.getEnvironmentRoutes(username, exe, environment)
    .then((results: any[]) => {
      return Promise.all(Lodash.map(results, (route) => {
        return this.executor.getExecutable(route.username, route.name, route.exe);
      }))
    })
  }

  public deleteExecutable(username: string, exe: string, name: string) {
    return this.getRoute(username, name, exe)
    .then((results: any[]) => {
      if (results.length > 0) {
        const route = results[0]
        return this.executor.deleteExecutable(route.username, route.exe, route.name)
        .then(() => {
          return this.deleteRoute(route.username, route.exe, route.name)
        });
      }
    })
  }

  public runExecutable(exe: string, username: string, name: string, data: any, token: string) {
    return this.getRoute(username, name, exe)
    .then((results: any[]) => {
      if (results.length > 0) {
        const route = results[0]
        const host = route.environment + "." + username
        const clientCommunicator: ClientCommunicator = new ClientCommunicator(host, 80)
        const client: Client = new Client(clientCommunicator);
        return client.runExecutable(route.username, route.exe, route.name, data, token);
      }
    })
  }

  private addRoute(username: string, name: string, exe: string, environment: string) {
    return this.databaseCommunicator.execute(Queries.ADD_ROUTE, {username: username, name: name, exe: exe, environment: environment})
  }

  private getRoute(username: string, name: string, exe: string) {
    return this.databaseCommunicator.execute(Queries.GET_ROUTE, {username: username, name: name, exe: exe})
  }

  private getUserRoutes(username: string, exe: string) {
    return this.databaseCommunicator.execute(Queries.GET_ROUTES_FOR_USER, {username: username, exe: exe})
  }

  private getEnvironmentRoutes(username: string, exe: string, environment: string) {
    return this.databaseCommunicator.execute(Queries.GET_ROUTES_FOR_ENVIRONMENT, {username: username, exe: exe, environment: environment})
  }

  private deleteRoute(username: string, exe: string, name: string) {
    return this.databaseCommunicator.execute(Queries.DELETE_ROUTE, {username: username, exe: exe, name: name})
  }

  public searchExecutables(searchText) {
    return this.databaseCommunicator.execute(Queries.SEARCH_ROUTES, {searchText: searchText})
  }
}
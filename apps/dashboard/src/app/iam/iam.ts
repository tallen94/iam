import { Injectable } from '@angular/core';
import { ClientCommunicator } from "./communicator";
import { ApiPaths } from "./api-paths";
import { environment } from "../../environments/environment";
import { HttpClient } from '@angular/common/http';

@Injectable()
export class Iam {
  private user: any;
  private executor: ClientCommunicator;
  private router: ClientCommunicator;

  constructor(httpClient: HttpClient) {
    this.user = {};
    const executorUrl = environment.executorUrl || window.location.hostname;
    const executorPort = environment.executorPort || 30001;
    const routerUrl = environment.routerUrl || window.location.hostname;
    const routerPort = environment.routerPort || 30005;
    this.executor = new ClientCommunicator(httpClient, executorUrl, executorPort);
    this.router = new ClientCommunicator(httpClient, routerUrl, routerPort);
  }

  public setUser(username: string, token: string) {
    this.user = {
      username: username,
      token: token
    }
  }

  public getUser() {
    return this.user;
  }

  public spawn(name: string, data: any) {
    return this.executor.post(
      ApiPaths.SPAWN_PROCESS, 
      data, 
      {type: "LOCAL", name: name}, 
      { "Content-type": "text/plain"},
      'text'
    );
  }

  public addExecutable(data: any) {
    return this.executor.post(ApiPaths.ADD_EXECUTABLE, data)
  }

  public getExecutable(username: string, exe: string, name: string) {
    return this.executor.get(ApiPaths.GET_EXECUTABLE, {username: username, name: name, exe: exe});
  }

  public getExecutables(username: string, exe: string) {
    return this.executor.get(ApiPaths.GET_EXECUTABLES, {username: username, exe: exe});
  }

  public runExecutable(username: string, exe: string, name: string, data: any) {
    return this.router.post(ApiPaths.RUN_EXECUTABLE, data, {username: username, exe: exe, name: name});
  }

  public searchExecutables(searchText: string) {
    return this.executor.get(ApiPaths.SEARCH_EXECUTABLES, {}, {searchText: searchText});
  }

  public getHost() {
    return this.executor.getHost();
  }

  public getStatus() {
    return this.executor.get(ApiPaths.GET_STATUS, {}, {});
  }

  public addClient(host: string, port: number) {
    return this.executor.post(ApiPaths.ADD_CLIENT, {host: host, port: port}, {});
  }
}
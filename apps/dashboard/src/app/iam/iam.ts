import { Injectable } from '@angular/core';
import { ClientCommunicator } from "./communicator";
import { ApiPaths } from "./api-paths";
import { environment } from "../../environments/environment";
import { HttpClient } from '@angular/common/http';

@Injectable()
export class Iam {
  private user: any;
  private router: ClientCommunicator;

  constructor(httpClient: HttpClient) {
    const routerUrl = window.location.hostname;
    const routerPort = parseInt(window.location.port);
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
    return this.router.post(
      ApiPaths.SPAWN_PROCESS, 
      data, 
      {type: "LOCAL", name: name}, 
      { "Content-type": "text/plain"},
      'text'
    );
  }

  public addExecutable(data: any) {
    return this.router.post(ApiPaths.ADD_EXECUTABLE, data)
  }

  public getExecutable(username: string, exe: string, name: string) {
    return this.router.get(ApiPaths.GET_EXECUTABLE, {username: username, name: name, exe: exe});
  }

  public getExecutables(username: string, exe: string) {
    return this.router.get(ApiPaths.GET_EXECUTABLES, {username: username, exe: exe});
  }

  public runExecutable(username: string, exe: string, name: string, data: any) {
    return this.router.post(ApiPaths.RUN_EXECUTABLE, data, {username: username, exe: exe, name: name});
  }

  public searchExecutables(searchText: string) {
    return this.router.get(ApiPaths.SEARCH_EXECUTABLES, {}, {searchText: searchText});
  }

  public getHost() {
    return this.router.getHost();
  }

  public getStatus() {
    return this.router.get(ApiPaths.GET_STATUS, {}, {});
  }

  public addClient(host: string, port: number) {
    return this.router.post(ApiPaths.ADD_CLIENT, {host: host, port: port}, {});
  }
}
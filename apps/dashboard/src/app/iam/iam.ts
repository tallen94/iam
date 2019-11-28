import { Injectable } from '@angular/core';
import { ClientCommunicator } from "./communicator";
import { ApiPaths } from "./api-paths";

@Injectable()
export class Iam {
  private clientCommunicator: ClientCommunicator;
  private user: any;

  constructor(clientCommunicator: ClientCommunicator) {
    this.clientCommunicator = clientCommunicator;
    this.user = {};
  }

  public setUser(username: string, userId: number, token: string) {
    this.user = {
      username: username,
      userId: userId,
      token: token
    }
  }

  public getUser() {
    return this.user;
  }

  public spawn(name: string, data: any) {
    return this.clientCommunicator.post(
      ApiPaths.SPAWN_PROCESS, 
      data, 
      {type: "LOCAL", name: name}, 
      { "Content-type": "text/plain"},
      'text'
    );
  }

  public addExecutable(data: any) {
    return this.clientCommunicator.post(ApiPaths.ADD_EXECUTABLE, data, {}, { user: JSON.stringify(this.user) })
  }

  public getExecutable(username: string, exe: string, name: string) {
    return this.clientCommunicator.get(ApiPaths.GET_EXECUTABLE, {username: username, name: name, exe: exe}, {}, { user: JSON.stringify(this.user) });
  }

  public getExecutables(username: string, exe: string) {
    return this.clientCommunicator.get(ApiPaths.GET_EXECUTABLES, {username: username, exe: exe}, {}, { user: JSON.stringify(this.user) });
  }

  public runExecutable(username: string, exe: string, name: string, data: any) {
    return this.clientCommunicator.post(ApiPaths.RUN_EXECUTABLE, data, {username: username, exe: exe, name: name}, { user: JSON.stringify(this.user) });
  }

  public searchExecutables(searchText: string) {
    return this.clientCommunicator.get(ApiPaths.SEARCH_EXECUTABLES, {}, {searchText: searchText}, { user: JSON.stringify(this.user) });
  }

  public getHost() {
    return this.clientCommunicator.getHost();
  }

  public getStatus() {
    return this.clientCommunicator.get(ApiPaths.GET_STATUS, {}, {}, { user: JSON.stringify(this.user) });
  }

  public addClient(host: string, port: number) {
    return this.clientCommunicator.post(ApiPaths.ADD_CLIENT, {host: host, port: port}, {}, { user: JSON.stringify(this.user) });
  }
}
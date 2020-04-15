import { Injectable } from '@angular/core';
import { ClientCommunicator } from "./communicator";
import { ApiPaths } from "./api-paths";
import { environment } from "../../environments/environment";
import { HttpClient } from '@angular/common/http';

@Injectable()
export class Iam {
  private user: any;
  private token: string;
  private client: ClientCommunicator;

  constructor(httpClient: HttpClient) {
    const routerUrl = window.location.hostname;
    const routerPort = environment.port;
    this.client = new ClientCommunicator(httpClient, routerUrl, routerPort);
  }

  public setUser(username: string, token: string) {
    this.user = {
      username: username,
      token: token
    }
    this.token = token;
  }

  public unsetUser() {
    this.user = undefined;
    this.token = undefined;
  }

  public getUser() {
    return this.user;
  }

  public spawn(name: string, data: any) {
    return this.client.post(
      ApiPaths.SPAWN_PROCESS, 
      data, 
      {type: "LOCAL", name: name}, 
      { "Content-type": "text/plain"},
      'text'
    );
  }

  public addUser(username: string, email: string, password: string) {
    return this.client.post(ApiPaths.ADD_USER, {username: username, email: email, password: password}, {})
  }

  public addUserSession(username: string, password: string) {
    return this.client.post(ApiPaths.ADD_USER_SESSION, {username: username, password: password}, {})
  }

  public deleteUserSession(token: string) {
    return this.client.delete(ApiPaths.DELETE_USER_SESSION, {token: token}, {})
  }

  public validateUserSession(token: string) {
    return this.client.post(ApiPaths.VALIDATE_USER_SESSION, {token: token}, {})
  }

  public addUserToken(username: string) {
    return this.client.post(ApiPaths.ADD_USER_TOKEN, {username: username}, {}, {sessiontoken: this.token})
  }

  public getUserTokens(username: string) {
    return this.client.get(ApiPaths.GET_USER_TOKENS, {}, {username: username}, {sessiontoken: this.token})
  }

  public deleteUserToken(tokenId: string) {
    return this.client.delete(ApiPaths.DELETE_USER_TOKEN, {tokenId: tokenId}, {}, {sessiontoken: this.token})
  }

  public addExecutable(data: any) {
    return this.client.post(ApiPaths.ADD_EXECUTABLE, data, {}, {sessiontoken: this.token})
  }

  public getExecutable(username: string, exe: string, name: string) {
    return this.client.get(ApiPaths.GET_EXECUTABLE, {username: username, name: name, exe: exe}, {}, {sessiontoken: this.token});
  }

  public getExecutables(username: string, exe: string) {
    return this.client.get(ApiPaths.GET_EXECUTABLES, {username: username, exe: exe}, {}, {sessiontoken: this.token});
  }

  public deleteExecutable(username: string, exe: string, name: string) {
    return this.client.delete(ApiPaths.DELETE_EXECUTABLE, {}, {username: username, exe: exe, name: name}, {sessiontoken: this.token})
  }

  public runExecutable(username: string, exe: string, name: string, data: any) {
    return this.client.post(ApiPaths.RUN_EXECUTABLE, data, {username: username, exe: exe, name: name}, {sessiontoken: this.token});
  }

  public searchExecutables(searchText: string) {
    return this.client.get(ApiPaths.SEARCH_EXECUTABLES, {}, {searchText: searchText}, {sessiontoken: this.token});
  }

  public getHost() {
    return this.client.getHost();
  }

  public getStatus() {
    return this.client.get(ApiPaths.GET_STATUS, {}, {});
  }

  public addClient(host: string, port: number) {
    return this.client.post(ApiPaths.ADD_CLIENT, {host: host, port: port}, {});
  }
}
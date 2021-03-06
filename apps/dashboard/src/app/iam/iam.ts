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
    const routerProtocol = window.location.protocol;
    const routerUrl = window.location.hostname;
    const routerPort = environment.production ? "" : environment.port;
    this.client = new ClientCommunicator(httpClient, routerProtocol, routerUrl, routerPort);
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

  public getBaseImage() {
    return this.client.get(ApiPaths.GET_BASE_IMAGE)
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

  public addAuthorization(resource_from: string, resource_to: string, visibility: string) {
    return this.client.post(ApiPaths.ADD_AUTHORIZATION, {resource_from: resource_from, resource_to: resource_to, visibility: visibility})
  }

  public addAuthorizationPrivilege(resource_from: string, resource_to: string, privilege: string) {
    return this.client.post(ApiPaths.ADD_AUTHORIZATION_PRIVILEGE, {resource_from: resource_from, resource_to: resource_to, privilege: privilege})
  }

  public deleteAuthorizationPrivilege(resource_from: string, resource_to: string, privilege: string) {
    return this.client.delete(ApiPaths.DELETE_AUTHORIZATION_PRIVILEGE, {resource_from: resource_from, resource_to: resource_to, privilege: privilege})
  }

  public getAuthorizationForResource(resource: string) {
    return this.client.get(ApiPaths.GET_AUTHORIZATION_FOR_RESOURCE, {}, {resource: resource})
  }

  public deleteAuthorization(resource_from: string, resource_to: string) {
    return this.client.delete(ApiPaths.DELETE_AUTHORIZATION, {resource_from: resource_from, resource_to: resource_to})
  }

  public addCluster(data: any) {
    return this.client.post(ApiPaths.ADD_CLUSTER, data, {}, {sessiontoken: this.token})
  }

  public getCluster(username: string, name: string) {
    return this.client.get(ApiPaths.GET_CLUSTER, {}, {username: username, name: name}, {sessiontoken: this.token})
  }

  public getClusterForUser(username: string) {
    return this.client.get(ApiPaths.GET_CLUSTER_FOR_USER, {}, {username: username}, {sessiontoken: this.token})
  }

  public deleteCluster(username: string, name: string) {
    return this.client.delete(ApiPaths.DELETE_CLUSTER, {username: username, name: name}, {}, {sessiontoken: this.token})
  }

  public addEnvironment(data: any) {
    return this.client.post(ApiPaths.ADD_ENVIRONMENT, data, {}, {sessiontoken: this.token})
  }

  public getEnvironment(username: string, name: string, cluster: string) {
    return this.client.get(ApiPaths.GET_ENVIRONMENT, {}, {username: username, name: name, cluster: cluster}, {sessiontoken: this.token})
  }

  public getEnvironmentForUser(username: string) {
    return this.client.get(ApiPaths.GET_ENVIRONMENT_FOR_USER, {}, {username: username}, {sessiontoken: this.token})
  }

  public getEnvironmentForCluster(username: string, cluster: string) {
    return this.client.get(ApiPaths.GET_ENVIRONMENT_FOR_CLUSTER, {}, {username: username, cluster: cluster}, {sessiontoken: this.token})
  }

  public deleteEnvironment(username: string, name: string, cluster: string) {
    return this.client.delete(ApiPaths.DELETE_CLUSTER, {username: username, name: name, cluster: cluster}, {}, {sessiontoken: this.token})
  }

  public addImage(data: any) {
    return this.client.post(ApiPaths.ADD_IMAGE, data, {}, {sessiontoken: this.token})
  }

  public getImage(username: string, name: string) {
    return this.client.get(ApiPaths.GET_IMAGE, {}, {username: username, name: name}, {sessiontoken: this.token})
  }

  public getImageForUser(username: string) {
    return this.client.get(ApiPaths.GET_IMAGE_FOR_USER, {}, {username: username}, {sessiontoken: this.token})
  }

  public deleteImage(username: string, name: string) {
    return this.client.delete(ApiPaths.DELETE_IMAGE, {username: username, name: name}, {}, {sessiontoken: this.token})
  }

  public buildImage(username: string, name: string) {
    return this.client.post(ApiPaths.BUILD_IMAGE, {username: username, name: name}, {}, {sessiontoken: this.token})
  }

  public startEnvironment(username: string, name: string, cluster: string) {
    return this.client.post(ApiPaths.START_ENVIRONMENT, {username: username, name: name, cluster: cluster}, {}, {sessiontoken: this.token})
  }

  public stopEnvironment(username: string, name: string, cluster: string) {
    return this.client.post(ApiPaths.STOP_ENVIRONMENT, {username: username, name: name, cluster: cluster}, {}, {sessiontoken: this.token})
  }

  public addExecutable(data: any) {
    return this.client.post(ApiPaths.ADD_EXECUTABLE, data, {}, {sessiontoken: this.token})
  }

  public getExecutable(username: string, cluster: string, environment: string, exe: string, name: string) {
    return this.client.get(ApiPaths.GET_EXECUTABLE, {username: username, cluster: cluster, environment: environment, name: name, exe: exe}, {}, {sessiontoken: this.token});
  }

  public getExecutables(username: string, exe: string) {
    return this.client.get(ApiPaths.GET_EXECUTABLES, {username: username, exe: exe}, {}, {sessiontoken: this.token});
  }

  public deleteExecutable(username: string, cluster: string, environment: string, exe: string, name: string) {
    return this.client.delete(ApiPaths.DELETE_EXECUTABLE, {}, {username: username, cluster: cluster, environment: environment, exe: exe, name: name}, {sessiontoken: this.token})
  }

  public runExecutable(username: string, cluster: string, environment: string, exe: string, name: string, data: any) {
    return this.client.post(ApiPaths.RUN_EXECUTABLE, data, {username: username, cluster: cluster, environment: environment, exe: exe, name: name}, {sessiontoken: this.token});
  }

  public searchExecutables(searchText: string) {
    return this.client.get(ApiPaths.SEARCH_EXECUTABLES, {}, {searchText: searchText}, {sessiontoken: this.token});
  }

  public addDataset(data: any) {
    return this.client.post(ApiPaths.ADD_DATASET, data)
  }

  public getDataset(username: string, cluster: string, environment: string, name: string) {
    return this.client.get(ApiPaths.GET_DATASET, {}, {username: username, cluster: cluster, environment: environment, name: name})
  }

  public getDatasetForUser(username: string) {
    return this.client.get(ApiPaths.GET_DATASET_FOR_USER, {}, {username: username})
  }

  public loadDataset(username: string, cluster: string, environment: string, name: string, executableData: any) {
    return this.client.post(ApiPaths.LOAD_DATASET, {username: username, cluster: cluster, environment: environment, name: name, executableData: executableData})
  }

  public transformDataset(username: string, cluster: string, environment: string, name: string, functionData: any) {
    return this.client.post(ApiPaths.TRANSFORM_DATASET, {username: username, cluster: cluster, environment: environment, name: name, functionData: functionData})
  }

  public readDataset(username: string, cluster: string, environment: string, name: string, tag: string, limit: number) {
    return this.client.get(ApiPaths.READ_DATASET, {}, {username: username, cluster: cluster, environment: environment, name: name, tag: tag, limit: limit})
  }

  public deleteDatasetTag(username: string, cluster: string, environment: string, name: string, tag: string) {
    return this.client.delete(ApiPaths.DELETE_DATASET_TAG, {username: username, cluster: cluster, environment: environment, name: name, tag: tag})
  }

  public addJob(data: any) {
    return this.client.post(ApiPaths.ADD_JOB, data, {}, {sessiontoken: this.token})
  }

  public getJob(username: string, name: string) {
    return this.client.get(ApiPaths.GET_JOB, {}, {username: username, name: name}, {sessiontoken: this.token})
  }

  public getJobsForUser(username: string) {
    return this.client.get(ApiPaths.GET_JOBS_FOR_USER, {}, {username: username}, {sessiontoken: this.token})
  }

  public deleteJob(username: string, name: string) {
    return this.client.delete(ApiPaths.DELETE_JOB, {username: username, name: name}, {}, {sessiontoken: this.token})
  }

  public enableJob(username: string, name: string) {
    return this.client.post(ApiPaths.ENABLE_JOB, {username: username, name: name}, {}, {sessiontoken: this.token})
  }

  public disableJob(username: string, name: string) {
    return this.client.post(ApiPaths.DISABLE_JOB, {username: username, name: name}, {}, {sessiontoken: this.token})
  }

  public addSecret(data: any) {
    return this.client.post(ApiPaths.ADD_SECRET, data, {}, {sessiontoken: this.token})
  }

  public getSecret(name: string, username: string) {
    return this.client.get(ApiPaths.GET_SECRET, {}, {name: name, username: username}, {sessiontoken: this.token})
  }

  public getSecretsForUser(username: string) {
    return this.client.get(ApiPaths.GET_SECRETS_FOR_USER, {}, {username: username}, {sessiontoken: this.token})
  }

  public deleteSecret(name: string, username: string) {
    return this.client.delete(ApiPaths.DELETE_SECRET, {name: name, username: username}, {}, {sessiontoken: this.token})
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
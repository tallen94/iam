import { Client } from "./Client";
import { AuthenticationClient } from "./AuthenticationClient";
import { UserClient } from "./UserClient";
import { AuthorizationClient } from "./AuthorizationClient";
import { ClusterClient } from "./ClusterClient";
import { EnvironmentClient } from "./EnvironmentClient";
import { ImageClient } from "./ImageClient";
import { DataClient } from "./DataClient";
import { AuthData } from "../Auth/AuthData";
import { JobClient } from "./JobClient";
import { SecretClient } from "./SecretClient";

export class ClientManager {

  constructor(
    private routerClient: Client,
    private authenticationClient: AuthenticationClient,
    private userClient: UserClient,
    private authorizationClient: AuthorizationClient,
    private clusterClient: ClusterClient,
    private environmentClient: EnvironmentClient,
    private imageClient: ImageClient,
    private dataClient: DataClient,
    private jobClient: JobClient,
    private secretClient: SecretClient
  ) {

  }

  public addCluster(data: any, authData: AuthData) {
    return this.clusterClient.addCluster(data, authData)
  }

  public getCluster(username: string, name: string, authData: AuthData) {
    return this.clusterClient.getCluster(username, name, authData)
  }

  public getClusterForUser(username: string, authData: AuthData) {
    return this.clusterClient.getClustersForUser(username, authData)
  }

  public deleteCluster(username: string, name: string, authData: AuthData) {
    return this.clusterClient.deleteCluster(username, name, authData)
  }

  public addEnvironment(data: any, authData: AuthData) {
    return this.environmentClient.addEnvironment(data, authData)
  }

  public getEnvironment(username: string, name: string, cluster: string, authData: AuthData) {
    return this.environmentClient.getEnvironment(username, name, cluster, authData)
  }

  public getEnvironmentForUser(username: string, authData: AuthData) {
    return this.environmentClient.getEnvironmentForUser(username, authData)
  }

  public getEnvironmentForCluster(username: string, cluster: string, authData: AuthData) {
    return this.environmentClient.getEnvironmentForCluster(username, cluster, authData)
  }

  public deleteEnvironment(username: string, name: string, cluster: string, authData: AuthData) {
    return this.environmentClient.deleteEnvironment(username, name, cluster, authData)
  }

  public addImage(data: any, authData: AuthData) {
    return this.imageClient.addImage(data, authData)
  }

  public getImage(username: string, name: string, authData: AuthData) {
    return this.imageClient.getImage(username, name, authData)
  }

  public getImageForUser(username: string, authData: AuthData) {
    return this.imageClient.getImageForUser(username, authData)
  }

  public deleteImage(username: string, name: string, authData: AuthData) {
    return this.imageClient.deleteImage(username, name, authData)
  }

  public buildImage(username: string, name: string, authData: AuthData) {
    return this.imageClient.buildImage(username, name, authData)
  }

  public startEnvironment(username: string, name: string, cluster: string, authData: AuthData) {
    return this.environmentClient.startEnvironment(username, name, cluster, authData)
  }

  public stopEnvironment(username: string, name: string, cluster: string, authData: AuthData) {
    return this.environmentClient.stopEnvironment(username, name, cluster, authData)
  }

  public addExecutable(data: any, authData: AuthData) {
    return this.routerClient.addExecutable(data, authData)
  }

  public getExecutable(username: string, cluster: string, environment: string, exe: string, name: string, authData: AuthData) {
    return this.routerClient.getExecutable(username, cluster, environment, exe, name, authData);
  }

  public getExecutables(username: string, exe: string, authData: AuthData) {
    return this.routerClient.getExecutables(username, exe, authData);
  }

  public deleteExecutable(username: string, cluster: string, environment: string, exe: string, name: string, authData: AuthData) {
    return this.routerClient.deleteExecutable(username, cluster, environment, exe, name, authData)
  }

  public runExecutable(username: string, cluster: string, environment: string, exe: string, name: string, data: any, authData: AuthData) {
    return this.routerClient.runExecutable(username, cluster, environment, exe, name, data, authData);
  }

  public searchExecutables(searchText: string) {
    return this.routerClient.searchExecutables(searchText)
  }

  public addUser(username: string, email: string, password: string) {
    return this.userClient.addUser(username, email)
    .then((result: any) => {
      if (result.success) {
        return this.authenticationClient.addUserPassword(username, password)
      }
    })
  }

  public addUserSession(username: string, password: string) {
    return this.userClient.getUser(username)
    .then((result: any) => {
      if (!result.error) {
        return this.authenticationClient.addUserSession(username, password)
      }
      return { error: "not found"}
    })
  }

  public deleteUserSession(token: string) {
    return this.authenticationClient.deleteUserSession(token)
  }

  public validateUserSession(token: string) {
    return this.authenticationClient.validateUserSession(token)
  }

  public addUserToken(username: string, sessionToken: string) {
    return this.userClient.getUser(username)
    .then((result: any) => {
      if (!result.error) {
        return this.authenticationClient.addUserToken(username, sessionToken)
      }
      return { error: "not found" }
    })
  }

  public getUserTokens(username: string, sessionToken: string) {
    return this.userClient.getUser(username)
    .then((result: any) => {
      if (!result.error) {
        return this.authenticationClient.getUserTokens(username, sessionToken)
      }
      return { error: "not found" }
    })
  }

  public deleteUserToken(tokenId: string, sessionToken: string) {
    return this.authenticationClient.deleteUserToken(tokenId, sessionToken)
  }

  public addAuthorization(resource_from: string, resource_to: string, visibility: string) {
    return this.authorizationClient.addAuthorization(resource_from, resource_to, visibility)
  }

  public addAuthorizationPrivilege(resource_from: string, resource_to: string, privilege: string) {
    return this.authorizationClient.addAuthorizationPrivilege(resource_from, resource_to, privilege)
  }

  public deleteAuthorizationPrivilege(resource_from: string, resource_to: string, privilege: string) {
    return this.authorizationClient.deleteAuthorizationPrivilege(resource_from, resource_to, privilege)
  }

  public getAuthorizationForResource(resource: string) {
    return this.authorizationClient.getAuthorizationForResource(resource)
  }

  public deleteAuthorization(resource_from: string, resource_to: string) {
    return this.authorizationClient.deleteAuthorization(resource_from, resource_to)
  }

  public addDataset(data: any) {
    return this.dataClient.addDataset(data)
  }
  
  public getDataset(username: string, cluster: string, environment: string, name: string) {
    return this.dataClient.getDataset(username, cluster, environment, name)
  }

  public getDatasetForUser(username: string) {
    return this.dataClient.getDatasetForUser(username)
  }

  public loadDataset(username: string, cluster: string, environment: string, name: string, queryData: any) {
    return this.dataClient.loadDataset(username, cluster, environment, name, queryData)
  }

  public transformDataset(username: string, cluster: string, environment: string, name: string, functionData: any) {
    return this.dataClient.transformDataset(username, cluster, environment, name, functionData)
  }

  public readDataset(username: string, cluster: string, environment: string, name: string, tag: string, limit: number) {
    return this.dataClient.readDataset(username, cluster, environment, name, tag, limit)
  }

  public deleteDatasetTag(username: string, cluster: string, environment: string, name: string, tag: string) {
    return this.dataClient.deleteDatasetTag(username, cluster, environment, name, tag)
  }

  public addJob(data: any, authData: AuthData) {
    return this.jobClient.addJob(data, authData)
  }

  public getJob(username: string, name: string, authData: AuthData) {
    return this.jobClient.getJob(username, name, authData)
  }

  public getJobsForUser(username: string, authData: AuthData) {
    return this.jobClient.getJobsForUser(username, authData)
  }

  public deleteJob(username: string, name: string, authData: AuthData) {
    return this.jobClient.deleteJob(username, name, authData)
  }

  public enableJob(username: string, name: string, authData: AuthData) {
    return this.jobClient.enableJob(username, name, authData)
  }

  public disableJob(username: string, name: string, authData: AuthData) {
    return this.jobClient.disableJob(username, name, authData)
  }

  public addSecret(data: any, authData: AuthData) {
    return this.secretClient.addSecret(data, authData)
  }

  public getSecret(name: string, username: string, authData: AuthData) {
    return this.secretClient.getSecret(name, username, authData)
  }

  public getSecretsForUser(username: string, authData: AuthData) {
    return this.secretClient.getSecretsForUser(username, authData)
  }

  public deleteSecret(name: string, username: string, authData: AuthData) {
    return this.secretClient.deleteSecret(name, username, authData)
  }
}

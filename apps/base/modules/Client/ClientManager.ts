import { Client } from "./Client";
import { AuthenticationClient } from "./AuthenticationClient";
import { UserClient } from "./UserClient";
import { AuthorizationClient } from "./AuthorizationClient";
import { ClusterClient } from "./ClusterClient";
import { EnvironmentClient } from "./EnvironmentClient";
import { ImageClient } from "./ImageClient";
import { DataClient } from "./DataClient";

export class ClientManager {

  constructor(
    private routerClient: Client,
    private authenticationClient: AuthenticationClient,
    private userClient: UserClient,
    private authorizationClient: AuthorizationClient,
    private clusterClient: ClusterClient,
    private environmentClient: EnvironmentClient,
    private imageClient: ImageClient,
    private dataClient: DataClient
  ) {

  }

  public addCluster(data: any) {
    return this.clusterClient.addCluster(data)
  }

  public getCluster(username: string, name: string) {
    return this.clusterClient.getCluster(username, name)
  }

  public getClusterForUser(username: string) {
    return this.clusterClient.getClustersForUser(username)
  }

  public deleteCluster(username: string, name: string) {
    return this.clusterClient.deleteCluster(username, name)
  }

  public addEnvironment(data: any) {
    return this.environmentClient.addEnvironment(data)
  }

  public getEnvironment(username: string, name: string, cluster: string) {
    return this.environmentClient.getEnvironment(username, name, cluster)
  }

  public getEnvironmentForUser(username: string) {
    return this.environmentClient.getEnvironmentForUser(username)
  }

  public getEnvironmentForCluster(username: string, cluster: string) {
    return this.environmentClient.getEnvironmentForCluster(username, cluster)
  }

  public deleteEnvironment(username: string, name: string, cluster: string) {
    return this.environmentClient.deleteEnvironment(username, name, cluster)
  }

  public addImage(data: any) {
    return this.imageClient.addImage(data)
  }

  public getImage(username: string, name: string) {
    return this.imageClient.getImage(username, name)
  }

  public getImageForUser(username: string) {
    return this.imageClient.getImageForUser(username)
  }

  public deleteImage(username: string, name: string) {
    return this.imageClient.deleteImage(username, name)
  }

  public buildImage(username: string, name: string) {
    return this.imageClient.buildImage(username, name)
  }

  public startEnvironment(username: string, name: string, cluster: string) {
    return this.environmentClient.startEnvironment(username, name, cluster)
  }

  public stopEnvironment(username: string, name: string, cluster: string) {
    return this.environmentClient.stopEnvironment(username, name, cluster)
  }

  public addExecutable(data: any) {
    return this.routerClient.addExecutable(data)
  }

  public getExecutable(username: string, cluster: string, environment: string, exe: string, name: string) {
    return this.routerClient.getExecutable(username, cluster, environment, exe, name);
  }

  public getExecutables(username: string, exe: string) {
    return this.routerClient.getExecutables(username, exe);
  }

  public deleteExecutable(username: string, cluster: string, environment: string, exe: string, name: string) {
    return this.routerClient.deleteExecutable(username, cluster, environment, exe, name)
  }

  public runExecutable(username: string, cluster: string, environment: string, exe: string, name: string, data: any, token: string) {
    return this.routerClient.runExecutable(username, cluster, environment, exe, name, data, token);
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
}

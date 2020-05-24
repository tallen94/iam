import {
  Executor, FileSystem, ServerCommunicator
} from "../modules";
import { ExecutableApi } from "../Api/ExecutableApi";
import { JobRunner } from "../Job/JobRunner";
import { DashboardApi } from "./DashboardApi";
import { FileSystemApi } from "../Api/FileSystemApi";
import { EnvironmentRouter } from "../Executor/EnvironmentRouter";
import { Database } from "../Executor/Database";
import { DatabaseCommunicator } from "../Communicator/DatabaseCommunicator";
import { EnvironmentRouterApi } from "./EnvironmentRouterApi";
import { FileSystemCommunicator } from "../Communicator/FileSystemCommunicator";
import { ClientCommunicator } from "../Communicator/ClientCommunicator";
import { Shell } from "../Executor/Shell";
import { ShellCommunicator } from "../Communicator/ShellCommunicator";
import { EnvironmentManager } from "../Environment/EnvironmentManager";
import { GraphExecutor } from "../Executor/GraphExecutor";
import { PoolManager } from "../Pool/PoolManager";
import { ExecutableFactory } from "../Executable/ExecutableFactory";
import { FileSystemFactory } from "../FileSystem/FileSystemFactory";
import { AuthorizationClient } from "../Client/AuthorizationClient";
import { Authentication } from "../Auth/Authentication";
import { AuthenticationApi } from "./AuthenticationApi";
import { UserApi } from "./UserApi";
import { Authorization } from "../Auth/Authorization";
import { AuthorizationApi } from "./AuthorizationApi";
import { UserManager } from "../User/UserManager";
import { AuthenticationClient } from "../Client/AuthenticationClient";
import { ClientApi } from "./ClientApi";
import { ClientManager } from "../Client/ClientManager";
import { Client } from "../Client/Client";
import { UserClient } from "../Client/UserClient";
import { ClusterManager } from "../Cluster/ClusterManager";
import { ClusterApi } from "./ClusterApi";
import { ClusterClient } from "../Client/ClusterClient";
import { EnvironmentApi } from "./EnvironmentApi";
import { EnvironmentClient } from "../Client/EnvironmentClient";

export class ApiFactory {

  // Service exposed to clients
  client(fileSystem: FileSystem, serverCommunicator: ServerCommunicator) {
    const clientConfig = {
      routerHost: process.env.ROUTER_HOST || process.argv[5],
      routerPort: process.env.ROUTER_PORT || process.argv[6],
      userHost: process.env.USER_HOST || process.argv[7],
      userPort: process.env.USER_PORT || process.argv[8],
      authHost: process.env.AUTH_HOST || process.argv[9],
      authPort: process.env.AUTH_PORT || process.argv[10],
      builderHost: process.env.BUILDER_HOST || process.argv[11],
      builderPort: process.env.BUILDER_PORT || process.argv[12]
    }

    const routerClient: Client = new Client(new ClientCommunicator(clientConfig.routerHost, parseInt(clientConfig.routerPort)))
    const userClient: UserClient = new UserClient(new ClientCommunicator(clientConfig.userHost, parseInt(clientConfig.userPort)))
    const authenticationClient: AuthenticationClient = new AuthenticationClient(new ClientCommunicator(clientConfig.authHost, parseInt(clientConfig.authPort)))
    const authorizationClient: AuthorizationClient = new AuthorizationClient(new ClientCommunicator(clientConfig.authHost, parseInt(clientConfig.authPort)))
    const clusterClient: ClusterClient = new ClusterClient(new ClientCommunicator(clientConfig.userHost, parseInt(clientConfig.userPort)))
    const environmentClient: EnvironmentClient = new EnvironmentClient(new ClientCommunicator(clientConfig.builderHost, parseInt(clientConfig.builderPort)))
    const clientManager: ClientManager = new ClientManager(routerClient, authenticationClient, userClient, authorizationClient, clusterClient, environmentClient)
    new ClientApi(serverCommunicator, clientManager)
    new DashboardApi(fileSystem, serverCommunicator);
  }

  // Internal service to store user information
  user(fileSystem: FileSystem, serverCommunicator: ServerCommunicator) {
    const dbconfig = {
      user: process.env.DB_USER || process.argv[5],
      password: process.env.DB_PASSWORD || process.argv[6], 
      host: process.env.DB_HOST || process.argv[7],
      port: process.env.DB_PORT || process.argv[8],
      database: process.env.DB_NAME || process.argv[9]
    };
    const databaseCommunicator: DatabaseCommunicator = this.constructDatabaseCommunicator(dbconfig)
    const userManager: UserManager = new UserManager(databaseCommunicator)
    const clusterManager: ClusterManager = new ClusterManager(databaseCommunicator)
    new UserApi(serverCommunicator, userManager)
    new ClusterApi(serverCommunicator, clusterManager)
  }

  // Internal service for routing executable requests
  router(fileSystem: FileSystem, serverCommunicator: ServerCommunicator) {
    const dbconfig = {
      user: process.env.DB_USER || process.argv[5],
      password: process.env.DB_PASSWORD || process.argv[6], 
      host: process.env.DB_HOST || process.argv[7],
      port: process.env.DB_PORT || process.argv[8],
      database: process.env.DB_NAME || process.argv[9]
    };
    const fsconfig = {
      host: process.env.FS_HOST || process.argv[10],
      port: process.env.FS_PORT || process.argv[11]
    }
    const databaseCommunicator: DatabaseCommunicator = this.constructDatabaseCommunicator(dbconfig)
    const environment = process.env.ENVIRONMENT || process.argv[12] || "base"
    const executor: Executor = this.constructExecutor(dbconfig, fsconfig, fileSystem, environment)
    const router: EnvironmentRouter = new EnvironmentRouter(databaseCommunicator, executor);
    new EnvironmentRouterApi(router, serverCommunicator);
  }

  builder(fileSystem: FileSystem, serverCommunicator: ServerCommunicator) {
    const dbconfig = {
      user: process.env.DB_USER || process.argv[5],
      password: process.env.DB_PASSWORD || process.argv[6], 
      host: process.env.DB_HOST || process.argv[7],
      port: process.env.DB_PORT || process.argv[8],
      database: process.env.DB_NAME || process.argv[9]
    };
    const fsconfig = {
      host: process.env.FS_HOST || process.argv[10],
      port: process.env.FS_PORT || process.argv[11]
    }
    const databaseCommunicator: DatabaseCommunicator = this.constructDatabaseCommunicator(dbconfig)
    const fileSystemCommunicator: FileSystemCommunicator = this.constructFileSystemCommunicator(fsconfig)
    const shellCommunicator: ShellCommunicator = new ShellCommunicator(fileSystem)
    const environmentManager: EnvironmentManager = new EnvironmentManager(fileSystem, fileSystemCommunicator, databaseCommunicator, shellCommunicator)
    new EnvironmentApi(serverCommunicator, environmentManager)
  }

  // Internal service for handling authentication and authorization
  auth(fileSystem: FileSystem, serverCommunicator: ServerCommunicator) {
    const dbconfig = {
      user: process.env.DB_USER || process.argv[5],
      password: process.env.DB_PASSWORD || process.argv[6], 
      host: process.env.DB_HOST || process.argv[7],
      port: process.env.DB_PORT || process.argv[8],
      database: process.env.DB_NAME || process.argv[9]
    };
    const databaseCommunicator: DatabaseCommunicator = this.constructDatabaseCommunicator(dbconfig)
    const authentication = new Authentication(databaseCommunicator)
    const authorization = new Authorization(databaseCommunicator)
    new AuthorizationApi(serverCommunicator, authorization);
    new AuthenticationApi(serverCommunicator, authentication)
  }

  // Internal service for managing and running executables
  executor(fileSystem: FileSystem, serverCommunicator: ServerCommunicator) {
    const dbconfig = {
      user: process.env.DB_USER || process.argv[5],
      password: process.env.DB_PASSWORD || process.argv[6], 
      host: process.env.DB_HOST || process.argv[7],
      port: process.env.DB_PORT || process.argv[8],
      database: process.env.DB_NAME || process.argv[9]
    };
    const fsconfig = {
      host: process.env.FS_HOST || process.argv[10],
      port: process.env.FS_PORT || process.argv[11]
    };
    const environment = process.env.ENVIRONMENT || process.argv[12] || "base"
    const executor: Executor = this.constructExecutor(dbconfig, fsconfig, fileSystem, environment)
    new ExecutableApi(executor, serverCommunicator);
    new FileSystemApi(fileSystem, serverCommunicator);
  }

  // Internal service for managing job execution
  job(fileSystem: FileSystem, serverCommunicator: ServerCommunicator) {
    const dbconfig = {
      user: process.env.DB_USER || process.argv[5],
      password: process.env.DB_PASSWORD || process.argv[6], 
      host: process.env.DB_HOST || process.argv[7],
      port: process.env.DB_PORT || process.argv[8],
      database: process.env.DB_NAME || process.argv[9]
    };
    const fsconfig = {
      host: process.env.FS_HOST || process.argv[10],
      port: process.env.FS_PORT || process.argv[11]
    };
    const environment = process.env.ENVIRONMENT || process.argv[12] || "base"
    const executor: Executor = this.constructExecutor(dbconfig, fsconfig, fileSystem, environment)
    const executableFactory: ExecutableFactory = this.constructExecutableFactory(dbconfig, fileSystem)
    new JobRunner(executor, executableFactory);
  }

  private constructExecutor(dbconfig: any, fsConfig: any, fileSystem: FileSystem, environment: string) {
    const executableFactory: ExecutableFactory = this.constructExecutableFactory(dbconfig, fileSystem)
    const fileSystemCommunicator: FileSystemCommunicator = this.constructFileSystemCommunicator(fsConfig)
    const databaseCommunicator: DatabaseCommunicator = this.constructDatabaseCommunicator(dbconfig)
    const authClientCommunicator: ClientCommunicator = new ClientCommunicator("auth.default", 80)
    const authorizationClient: AuthorizationClient = new AuthorizationClient(authClientCommunicator)
    const database: Database = this.constructDatabase(databaseCommunicator, fileSystemCommunicator);
    const shell: Shell = this.constructShell(fileSystem, fileSystemCommunicator, databaseCommunicator);
    const environmentManager: EnvironmentManager = this.constructEnvironmentManager(fileSystemCommunicator, fileSystem, databaseCommunicator);
    const graphExecutor: GraphExecutor = this.constructGraphExecutor(databaseCommunicator);
    const poolManager: PoolManager = this.constructPoolManager(shell, database, graphExecutor, fileSystem, environment, executableFactory)
    return new Executor(database, shell, environmentManager, graphExecutor, poolManager, executableFactory, databaseCommunicator, authorizationClient);
  }

  private constructExecutableFactory(dbconfig: any, fileSystem: FileSystem) {
    const databaseCommunicator: DatabaseCommunicator = this.constructDatabaseCommunicator(dbconfig);
    const fileSystemFactory: FileSystemFactory = new FileSystemFactory();
    return new ExecutableFactory(fileSystemFactory, fileSystem, new ShellCommunicator(fileSystem), databaseCommunicator);
  }

  private constructDatabase(databaseCommunicator: DatabaseCommunicator, fileSystemCommunicator: FileSystemCommunicator) {
    return new Database(databaseCommunicator, fileSystemCommunicator);
  }

  private constructShell(fileSystem: FileSystem, fileSystemCommunicator: FileSystemCommunicator, databaseCommunicator: DatabaseCommunicator) {
    const shellCommunicator: ShellCommunicator = new ShellCommunicator(fileSystem);
    return new Shell(shellCommunicator, fileSystemCommunicator, databaseCommunicator);
  }

  private constructEnvironmentManager(fileSystemCommunicator: FileSystemCommunicator, fileSystem: FileSystem, databaseCommunicator: DatabaseCommunicator) {
    const shellCommunicator: ShellCommunicator = new ShellCommunicator(fileSystem)
    return new EnvironmentManager(fileSystem, fileSystemCommunicator, databaseCommunicator, shellCommunicator);
  }

  private constructGraphExecutor(databaseCommunicator: DatabaseCommunicator) {
    return new GraphExecutor(databaseCommunicator);
  }

  public constructPoolManager(shell: Shell, database: Database, graphExecutor: GraphExecutor, fileSystem: FileSystem, environment, executableFactory: ExecutableFactory) {
    return new PoolManager(shell, database, graphExecutor, fileSystem, environment, executableFactory);
  }

  public constructFileSystemCommunicator(fsConfig: any) {
    const fsClient = new ClientCommunicator(fsConfig["host"], fsConfig["port"]);
    return new FileSystemCommunicator(fsClient);
  }

  public constructDatabaseCommunicator(config: any) {
    return new DatabaseCommunicator(config.user, config.password, config.host, config.port, config.database);
  }
}
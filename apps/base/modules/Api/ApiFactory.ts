import {
  Executor, FileSystem, ServerCommunicator
} from "../modules";
import { ExecutableApi } from "../Api/ExecutableApi";
import { StatusApi } from "./StatusApi";
import { JobRunner } from "../Job/JobRunner";
import { DashboardApi } from "./DashboardApi";
import { FileSystemApi } from "../Api/FileSystemApi";
import { EnvironmentRouter } from "../Executor/EnvironmentRouter";
import { Database } from "../Executor/Database";
import { DatabaseCommunicator } from "../Communicator/DatabaseCommunicator";
import { EnvironmentRouterApi } from "./EnvironmentRouterApi";
import { FileSystemCommunicator } from "../Communicator/FileSystemCommunicator";
import { ClientCommunicator } from "../Communicator/ClientCommunicator";
import { Authorization } from "../Auth/Authorization";
import { Shell } from "../Executor/Shell";
import { ShellCommunicator } from "../Communicator/ShellCommunicator";
import { EnvironmentManager } from "../Environment/EnvironmentManager";
import { GraphExecutor } from "../Executor/GraphExecutor";
import { PoolManager } from "../Pool/PoolManager";

export class ApiFactory {

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
    };
    const environment = process.env.ENVIRONMENT || process.argv[12] || "base"
    new StatusApi(serverCommunicator);
    const executor: Executor = this.constructExecutor(dbconfig, fsconfig, fileSystem, environment)
    const authorization: Authorization = new Authorization(executor);
    const router: EnvironmentRouter = new EnvironmentRouter(executor, authorization);
    new EnvironmentRouterApi(router, serverCommunicator);
    new DashboardApi(fileSystem, serverCommunicator);
  }

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
    new StatusApi(serverCommunicator);
    const executor: Executor = this.constructExecutor(dbconfig, fsconfig, fileSystem, environment)
    new ExecutableApi(executor, serverCommunicator);
    new FileSystemApi(fileSystem, serverCommunicator);
  }

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
    new StatusApi(serverCommunicator);
    const executor: Executor = this.constructExecutor(dbconfig, fsconfig, fileSystem, environment)
    new JobRunner(executor);
  }

  private constructExecutor(dbconfig: any, fsconfig: any, fileSystem: FileSystem, environment: string) {
    const database: Database = this.constructDatabase(dbconfig, fsconfig);
    const shell: Shell = this.constructShell(fileSystem, database, fsconfig);
    const environmentManager: EnvironmentManager = this.constructEnvironmentManager(shell, database, fsconfig, fileSystem);
    const graphExecutor: GraphExecutor = this.constructGraphExecutor(database, shell);
    const poolManager: PoolManager = this.constructPoolManager(shell, database, graphExecutor, fileSystem, environment)
    return new Executor(database, shell, environmentManager, graphExecutor, poolManager);
  }

  private constructDatabase(config: any, fsConfig: any) {
    const databaseCommunicator: DatabaseCommunicator = new DatabaseCommunicator(config.user, config.password, config.host, config.port, config.database);
    const fsClient = new ClientCommunicator(fsConfig["host"], fsConfig["port"]);
    const fileSystemCommunicator: FileSystemCommunicator = new FileSystemCommunicator(fsClient);
    return new Database(databaseCommunicator, fileSystemCommunicator);
  }

  private constructShell(fileSystem: FileSystem, database: Database, fsConfig: any) {
    const fsClient = new ClientCommunicator(fsConfig["host"], fsConfig["port"]);
    const shellCommunicator: ShellCommunicator = new ShellCommunicator();
    const fileSystemCommunicator: FileSystemCommunicator = new FileSystemCommunicator(fsClient);
    return new Shell(shellCommunicator, fileSystemCommunicator, database, fileSystem);
  }

  private constructEnvironmentManager(shell: Shell, database: Database, fsConfig: any, fileSystem: FileSystem) {
    const fsClient = new ClientCommunicator(fsConfig["host"], fsConfig["port"])
    const fileSystemCommunicator: FileSystemCommunicator = new FileSystemCommunicator(fsClient);
    return new EnvironmentManager(fileSystem, shell, database, fileSystemCommunicator);
  }

  private constructGraphExecutor(database: Database, shell: Shell) {
    return new GraphExecutor(database, shell);
  }

  public constructPoolManager(shell: Shell, database: Database, graphExecutor: GraphExecutor, fileSystem: FileSystem, environment) {
    return new PoolManager(shell, database, graphExecutor, fileSystem, environment);
  }
}
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
import { ExecutableFactory } from "../Executable/ExecutableFactory";
import { ExecutableManager } from "../Executable/ExecutableManager";
import { FileSystemFactory } from "../FileSystem/FileSystemFactory";

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
    const executableFactory: ExecutableFactory = this.constructExecutableFactory(dbconfig, fileSystem)
    const router: EnvironmentRouter = new EnvironmentRouter(executor, new Authorization(executableFactory));
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
    const executableFactory: ExecutableFactory = this.constructExecutableFactory(dbconfig, fileSystem)
    new JobRunner(executor, executableFactory);
  }

  private constructExecutor(dbconfig: any, fsConfig: any, fileSystem: FileSystem, environment: string) {
    const executableFactory: ExecutableFactory = this.constructExecutableFactory(dbconfig, fileSystem)
    const authorization: Authorization = new Authorization(executableFactory);
    const fileSystemCommunicator: FileSystemCommunicator = this.constructFileSystemCommunicator(fsConfig)
    const database: Database = this.constructDatabase(dbconfig, fileSystemCommunicator, executableFactory);
    const shell: Shell = this.constructShell(fileSystemCommunicator, executableFactory);
    const environmentManager: EnvironmentManager = this.constructEnvironmentManager(fileSystemCommunicator, fileSystem, executableFactory);
    const graphExecutor: GraphExecutor = this.constructGraphExecutor(executableFactory);
    const poolManager: PoolManager = this.constructPoolManager(shell, database, graphExecutor, fileSystem, environment, executableFactory)
    const executableManager: ExecutableManager = this.constructExecutableManager(executableFactory, authorization)
    return new Executor(database, shell, environmentManager, graphExecutor, poolManager, authorization, executableManager, executableFactory);
  }

  private constructExecutableFactory(dbconfig: any, fileSystem: FileSystem) {
    const databaseCommunicator: DatabaseCommunicator = this.constructDatabaseCommunicator(dbconfig);
    const fileSystemFactory: FileSystemFactory = new FileSystemFactory();
    return new ExecutableFactory(fileSystemFactory, fileSystem, new ShellCommunicator(), databaseCommunicator);
  }

  private constructDatabase(databaseCommunicator: DatabaseCommunicator, fileSystemCommunicator: FileSystemCommunicator, executableFactory: ExecutableFactory) {
    return new Database(databaseCommunicator, fileSystemCommunicator, executableFactory);
  }

  private constructShell(fileSystemCommunicator: FileSystemCommunicator, executableFactory: ExecutableFactory) {
    const shellCommunicator: ShellCommunicator = new ShellCommunicator();
    return new Shell(shellCommunicator, fileSystemCommunicator, executableFactory);
  }

  private constructEnvironmentManager(fileSystemCommunicator: FileSystemCommunicator, fileSystem: FileSystem, executableFactory: ExecutableFactory) {
    return new EnvironmentManager(fileSystem, fileSystemCommunicator, executableFactory);
  }

  private constructGraphExecutor(executableFactory: ExecutableFactory) {
    return new GraphExecutor(executableFactory);
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

  public constructExecutableManager(executableFactory: ExecutableFactory, authorization: Authorization) {
    return new ExecutableManager(executableFactory, authorization)
  }
}
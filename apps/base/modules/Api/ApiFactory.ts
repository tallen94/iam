import {
  Executor, FileSystem, ClientPool, ServerCommunicator
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
    const databaseCommunicator: DatabaseCommunicator = new DatabaseCommunicator(
      dbconfig.user,
      dbconfig.password,
      dbconfig.host,
      parseInt(dbconfig.port),
      dbconfig.database
    )
    const clientCommunicator: ClientCommunicator = new ClientCommunicator(fsconfig.host, parseInt(fsconfig.port))
    const fileSystemCommunicator: FileSystemCommunicator = new FileSystemCommunicator(clientCommunicator)
    const database = new Database(databaseCommunicator, fileSystemCommunicator);
    const clientThreadPool: ClientPool = new ClientPool();
    const executor: Executor = new Executor(environment, fileSystem, dbconfig, fsconfig, clientThreadPool);
    const router: EnvironmentRouter = new EnvironmentRouter(database);
    const authorization: Authorization = new Authorization(database);
    new EnvironmentRouterApi(router, serverCommunicator, executor, authorization);
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
    const clientThreadPool: ClientPool = new ClientPool();
    new StatusApi(serverCommunicator);
    const executor: Executor = new Executor(environment, fileSystem, dbconfig, fsconfig, clientThreadPool);
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
    const clientThreadPool: ClientPool = new ClientPool();
    new StatusApi(serverCommunicator);
    const executor: Executor = new Executor(environment, fileSystem, dbconfig, fsconfig, clientThreadPool);
    new JobRunner(executor);
  }
}
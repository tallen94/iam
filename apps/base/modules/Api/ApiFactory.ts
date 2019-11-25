import {
  Executor, FileSystem, ClientPool, ServerCommunicator, ClientCommunicator
} from "../modules";
import { ExecutableApi } from "../Api/ExecutableApi";
import { StatusApi } from "./StatusApi";
import { JobRunner } from "../Job/JobRunner";
import { DashboardApi } from "./DashboardApi";
import { FileSystemApi } from "../Api/FileSystemApi";
import { FileSystemCommunicator } from "../Communicator/FileSystemCommunicator";

export class ApiFactory {

  master(fileSystem: FileSystem, serverCommunicator: ServerCommunicator) {
    const dbconfig = {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME
    };
    const fsconfig = {
      host: process.env.FS_HOST,
      port: process.env.FS_PORT
    };
    const clientThreadPool: ClientPool = new ClientPool();
    new StatusApi(serverCommunicator);
    const executor: Executor = new Executor(fileSystem, dbconfig, fsconfig, clientThreadPool);
    executor.addClientThread("iam-executor.default", 80);
    new ExecutableApi(executor, serverCommunicator);
  }

  job(fileSystem: FileSystem, serverCommunicator: ServerCommunicator) {
    const dbconfig = {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME
    };
    const fsconfig = {
      host: process.env.FS_HOST,
      port: process.env.FS_PORT
    };
    const clientThreadPool: ClientPool = new ClientPool();
    new StatusApi(serverCommunicator);
    const executor: Executor = new Executor(fileSystem, dbconfig, fsconfig, clientThreadPool);
    new JobRunner(executor);
  }

  executor(fileSystem: FileSystem, serverCommunicator: ServerCommunicator) {
    const dbconfig = {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME
    };
    const fsconfig = {
      host: process.env.FS_HOST,
      port: process.env.FS_PORT
    };
    const clientThreadPool: ClientPool = new ClientPool();
    new StatusApi(serverCommunicator);
    const executor: Executor = new Executor(fileSystem, dbconfig, fsconfig, clientThreadPool);
    new ExecutableApi(executor, serverCommunicator);
  }

  dashboard(fileSystem: FileSystem, serverCommunicator: ServerCommunicator) {
    new StatusApi(serverCommunicator);
    new DashboardApi(fileSystem, serverCommunicator);
  }

  filesystem(fileSystem: FileSystem, serverCommunicator: ServerCommunicator) {
    new StatusApi(serverCommunicator);
    new FileSystemApi(fileSystem, serverCommunicator);
  }
}
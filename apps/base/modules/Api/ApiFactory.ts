import {
  Executor, FileSystem, ClientPool, ServerCommunicator
} from "../modules";
import { ExecutableApi } from "../Api/ExecutableApi";
import { StatusApi } from "./StatusApi";
import { JobRunner } from "../Job/JobRunner";
import { DashboardApi } from "./DashboardApi";
import { FileSystemApi } from "../Api/FileSystemApi";

export class ApiFactory {

  master(fileSystem: FileSystem, serverCommunicator: ServerCommunicator) {
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
    const clientThreadPool: ClientPool = new ClientPool();
    new StatusApi(serverCommunicator);
    const executor: Executor = new Executor(fileSystem, dbconfig, fsconfig, clientThreadPool);
    // executor.addClientThread("iam-executor.default", 80);
    executor.addClientThread("iam-local", 30004);
    new ExecutableApi(executor, serverCommunicator);
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
    const clientThreadPool: ClientPool = new ClientPool();
    new StatusApi(serverCommunicator);
    const executor: Executor = new Executor(fileSystem, dbconfig, fsconfig, clientThreadPool);
    new JobRunner(executor);
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
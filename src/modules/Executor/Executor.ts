import {
  Client,
  Shell,
  Database,
  ShellCommunicator,
  ClientCommunicator,
  DatabaseCommunicator,
  FileSystem
} from "../modules";
import { ClientPool } from "./ClientPool";
import { StepListManager } from "../Step/StepListManager";
import * as Lodash from "lodash";
import { JobRunner } from "../Job/JobRunner";
import { FileSystemCommunicator } from "../Communicator/FileSystemCommunicator";

export class Executor {

  private shell: Shell;
  private database: Database;
  private clientPool: ClientPool;
  private stepListManager: StepListManager;
  private jobRunner: JobRunner;

  constructor() {}

  public setJobRunner(jobRunner: JobRunner) {
    this.jobRunner = jobRunner;
  }

  public init(fileSystem: FileSystem, dbConfig: any, fsConfig: any, clientPool: ClientPool) {
    this.clientPool = clientPool;
    this.setDatabase(dbConfig);
    this.setShell(fileSystem, this.database, fsConfig);
    this.setStepListManager(this.shell, this.database, clientPool);
  }

  public status(): Promise<any> {
    return Promise.all([
      this.shell.getStatus(),
      this.database.getStatus(),
      this.clientPool.getStatus()
    ]);
  }

  public addExecutable(type: string, name: string, data: any, dataType: string, dataModel: string, userId: number, description: string) {
    switch (type) {
      case "PROGRAM":
        return this.shell.addProgram(name, data, dataType, dataModel, userId, description);
      case "COMMAND":
        return this.shell.addCommand(name, data, dataType, dataModel, userId, description);
      case "QUERY":
        return this.database.addQuery(name, data, dataType, dataModel, userId, description);
      case "STEPLIST":
        return this.stepListManager.addStepList(name, data, dataType, dataModel, userId, description);
      case "JOB":
        return this.jobRunner.addJob(name, data, dataType, dataModel, userId, description);
    }
  }

  public getExecutable(type: string, name: string): Promise<any> {
    switch (type) {
      case "PROGRAM":
        return this.shell.getProgram(name);
      case "COMMAND":
        return this.shell.getCommand(name);
      case "QUERY":
        return this.database.getQuery(name);
      case "STEPLIST":
        return this.stepListManager.getStepList(name);
      case "JOB":
        return this.jobRunner.getJob(name);
    }
  }

  public getExecutables(type: string, userId: number) {
    switch (type) {
      case "PROGRAM":
        return this.shell.getPrograms(userId);
      case "COMMAND":
        return this.shell.getCommands(userId);
      case "QUERY":
        return this.database.getQueries(userId);
      case "STEPLIST":
        return this.stepListManager.getStepLists(userId);
      case "JOB":
        return this.jobRunner.getJobs(userId);
    }
  }

  public runExecutable(type: string, name: string, data: any) {
    switch (type) {
      case "PROGRAM":
        return this.shell.runProgram(name, data);
      case "COMMAND":
        return this.shell.runCommand(name, data);
      case "QUERY":
        return this.database.runQuery(name, data);
      case "STEPLIST":
        return this.stepListManager.runStepList(name, data);
    }
  }

  public searchExecutables(searchText: string) {
    return this.database.runQuery("search-executable", {searchText: searchText})
    .then((results) => {
      const groups = {};
      Lodash.each(results, (item) => {
        if (groups[item.type] == undefined) {
          groups[item.type] = [];
        }

        groups[item.type].push(item);
      });
      return groups;
    });
  }

  public getShell(): Shell {
    return this.shell;
  }

  public getDatabase(): Database {
    return this.database;
  }

  public getClientPool(): ClientPool {
    return this.clientPool;
  }

  public getStepListManager(): StepListManager {
    return this.stepListManager;
  }

  private setShell(fileSystem: FileSystem, database: Database, fsConfig: any) {
    const fsClient = new ClientCommunicator(fsConfig["host"], fsConfig["port"]);
    const shellCommunicator: ShellCommunicator = new ShellCommunicator();
    const fileSystemCommunicator: FileSystemCommunicator = new FileSystemCommunicator(fsClient);
    const thread = new Shell(shellCommunicator, fileSystemCommunicator, database, fileSystem);
    this.shell = thread;
    return this.shell;
  }

  private setDatabase(config: any) {
    const databaseCommunicator: DatabaseCommunicator = new DatabaseCommunicator(config.user, config.password, config.host, config.database);
    const thread = new Database(databaseCommunicator);
    this.database = thread;
    return this.database;
  }

  public setClientPool(host: string, port: number) {
    return this.database.runQuery("getNodesNotWithHostPort", {host: host, port: port})
    .then((results) => {
      Lodash.each(results, (node) => {
        this.addClientThread(node.host, node.port);
      });
    });
  }

  private setStepListManager(shell: Shell, database: Database, clientPool: ClientPool) {
    const thread = new StepListManager(shell, database, clientPool);
    this.stepListManager = thread;
    return this.stepListManager;
  }

  public addClientThread(host: string, port: number) {
    const clientCommunicator: ClientCommunicator = new ClientCommunicator(host, port);
    this.clientPool.addClient(new Client(clientCommunicator));
  }
}
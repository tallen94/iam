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

  public init(fileSystem: FileSystem, dbConfig: any, clientPool: ClientPool): Promise<any> {
    this.clientPool = clientPool;
    this.setDatabase(dbConfig);
    this.setShell(fileSystem, this.database);
    return this.setStepListManager(this.shell, this.database, clientPool);
  }

  public status(): Promise<any> {
    return Promise.all([
      this.shell.getStatus(),
      this.database.getStatus(),
      this.clientPool.getStatus()
    ]);
  }

  public update(pkg: any) {
    return Promise.all([
      this.shell.update(),
      this.clientPool.update(pkg)
    ]);
  }

  public addExecutable(type: string, name: string, data: any, dataType: string, dataModel: string, userId: number) {
    switch (type) {
      case "PROGRAM":
        return this.shell.addProgram(name, data, dataType, dataModel, userId);
      case "COMMAND":
        return this.shell.addCommand(name, data, dataType, dataModel, userId);
      case "QUERY":
        return this.database.addQuery(name, data, dataType, dataModel, userId);
      case "STEPLIST":
        return this.stepListManager.addStepList(name, data.async, data.steps, dataType, dataModel, userId);
      case "JOB":
        return this.jobRunner.addJob(name, data, dataType, dataModel, userId);
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
    return this.database.runQuery("get-exe-for-user", {type: type, userId: userId});
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

  public addProgram(name: string, exe: string, filename: string, run: string, program: any, dataType: string, dataModel: string, userId: number) {
    return Promise.all([
      this.shell.addProgram(name, exe, filename, run, userId),
      this.clientPool.addProgram(name, exe, filename, run, program, dataType, dataModel)
    ]);
  }

  public getProgram(name: string) {
    return this.shell.getProgram(name);
  }

  public getPrograms() {
    return this.shell.getPrograms();
  }

  public addCommand(name: string, command: string, dataType: string, dataModel: string, userId: number) {
    return Promise.all([
      this.shell.addCommand(name, command, dataType, dataModel, userId),
      this.clientPool.addCommand(name, command, dataType, dataModel)
    ]);
  }

  public getCommand(name: string) {
    return this.shell.getCommand(name);
  }

  public getCommands() {
    return this.shell.getCommands();
  }

  public addQuery(name: string, query: string, dataType: string, dataModel: string, userId: number) {
    return Promise.all([
      this.database.addQuery(name, query, dataType, dataModel, userId),
      this.clientPool.addQuery(name, query, dataType, dataModel, userId)
    ]);
  }

  public getQuery(name: string) {
    return this.database.getQuery(name);
  }

  public getQueries() {
    return this.database.getQueries();
  }

  public addStepList(name: string, async: boolean, steps: any[], dataType: string, dataModel: string, userId: number) {
    return Promise.all([
      this.stepListManager.addStepList(name, async, steps, dataType, dataModel, userId),
      this.clientPool.addStepList(name, async, steps, dataType, dataModel, userId)
    ]);
  }

  public getStepList(name: string) {
    return this.stepListManager.getStepList(name);
  }

  public getStepLists() {
    return this.stepListManager.getStepLists();
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

  private setShell(fileSystem: FileSystem, database: Database) {
    const shellCommunicator: ShellCommunicator = new ShellCommunicator();
    const thread = new Shell(shellCommunicator, database, fileSystem);
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
    return thread.loadData().then((result) => {
      this.stepListManager = thread;
      return this.stepListManager;
    });
  }

  public addClientThread(host: string, port: number) {
    const clientCommunicator: ClientCommunicator = new ClientCommunicator(host, port);
    this.clientPool.addClient(new Client(clientCommunicator));
  }
}
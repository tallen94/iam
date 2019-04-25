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

export class Executor {

  private shell: Shell;
  private database: Database;
  private clientPool: ClientPool;
  private stepListManager: StepListManager;

  constructor() {}

  public init(fileSystem: FileSystem, dbConfig: any, clientPool: ClientPool): Promise<any> {
    this.clientPool = clientPool;
    return this.setDatabase(dbConfig)
    .then((database) => {
      return this.setShell(fileSystem, database);
    }).then((result) => {
      return this.setStepListManager(this.shell, this.database, clientPool);
    });
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

  public addExecutable(type: string, name: string, data: any) {
    switch (type) {
      case "PROGRAM":
        return this.shell.addProgram(name, data);
      case "COMMAND":
        return this.shell.addCommand(name, data);
      case "QUERY":
        return this.database.addQuery(name, data);
      case "STEPLIST":
        return this.stepListManager.addStepList(name, data.async, data.steps);
    }
  }

  public getExecutable(type: string, name: string) {
    switch (type) {
      case "PROGRAM":
        return this.shell.getProgram(name);
      case "COMMAND":
        return this.shell.getCommand(name);
      case "QUERY":
        return this.database.getQuery(name);
      case "STEPLIST":
        return this.stepListManager.getStepList(name);
    }
  }

  public getExecutables(type: string) {
    return this.database.runQuery("get-exe-by-type", {type: type});
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

  public addProgram(name: string, exe: string, filename: string, run: string, program: any) {
    return Promise.all([
      // this.shell.addProgram(name, exe, filename, run),
      this.clientPool.addProgram(name, exe, filename, run, program)
    ]);
  }

  public getProgram(name: string) {
    return this.shell.getProgram(name);
  }

  public getPrograms() {
    return this.shell.getPrograms();
  }

  public addCommand(name: string, command: string) {
    return Promise.all([
      this.shell.addCommand(name, command),
      this.clientPool.addCommand(name, command)
    ]);
  }

  public getCommand(name: string) {
    return this.shell.getCommand(name);
  }

  public getCommands() {
    return this.shell.getCommands();
  }

  public addQuery(name: string, query: string) {
    return Promise.all([
      this.database.addQuery(name, query),
      this.clientPool.addQuery(name, query)
    ]);
  }

  public getQuery(name: string) {
    return this.database.getQuery(name);
  }

  public getQueries() {
    return this.database.getQueries();
  }

  public addStepList(name: string, async: boolean, steps: any[]) {
    return Promise.all([
      this.stepListManager.addStepList(name, async, steps),
      this.clientPool.addStepList(name, async, steps)
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
    return thread.loadData()
    .then((result) => {
      // thread.addCommand("system-update", "sudo apt-get update");
      // thread.addCommand("system-upgrade", "sudo apt-get upgrade -y");
      // thread.addCommand("system-restart", "sudo restart now");
      // thread.addCommand("system-install", "sudo apt-get install {0} -y");
      // thread.addCommand("node-install", "bash " + fileSystem.path("/install"));
      // thread.addCommand("node-update", "bash " + fileSystem.path("/update"));
      // thread.addCommand("node-clone", "bash " + fileSystem.path("/clone") + " {0} {1}");
      // thread.addCommand("node-restart", "sudo systemctl restart deploy");
      this.shell = thread;
      return this.shell;
    });
  }

  private setDatabase(config: any) {
    const databaseCommunicator: DatabaseCommunicator = new DatabaseCommunicator(config.user, config.password, config.host, config.database);
    const thread = new Database(databaseCommunicator);
    return thread.loadData().then((result) => {
      // thread.addQuery("current-time", "SELECT NOW() AS currentTime");
      // thread.addQuery("add-exe", "INSERT INTO executable(name, data, type) VALUES(\'{name}\', \'{data}\', \'{type}\');");
      // thread.addQuery("get-exe-by-name", "SELECT * FROM executable WHERE name=\'{name}\';");
      // thread.addQuery("get-exe-by-type", "SELECT * FROM executable WHERE type=\'{type}\';");
      this.database = thread;
      return this.database;
    });
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
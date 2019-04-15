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

export class Executor {

  private shell: Shell;
  private database: Database;
  private clientPool: ClientPool;
  private stepListManager: StepListManager;

  constructor(fileSystem: FileSystem, dbConfig: any, clientPool: ClientPool) {
    this.setShell(fileSystem);
    this.setDatabase(dbConfig);
    this.setStepListManager(this.shell, this.database, clientPool);
    this.clientPool = clientPool;
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

  public addProgram(name: string, exe: string, filename: string, root: string, run: string, program: any) {
    return Promise.all([
      this.shell.addProgram(name, exe, filename, root, run),
      this.clientPool.addProgram(name, exe, filename, run, program)
    ]);
  }

  public addCommand(name: string, command: string) {
    return Promise.all([
      this.shell.addCommand(name, command),
      this.clientPool.addCommand(name, command)
    ]);
  }

  public addQuery(name: string, query: string) {
    return Promise.all([
      this.database.addQuery(name, query),
      this.clientPool.addQuery(name, query)
    ]);
  }

  public addSyncStepList(name: string, steps: any[]) {
    return Promise.all([
      this.stepListManager.addSyncStepList(name, steps),
      this.clientPool.addSyncStepList(name, steps)
    ]);
  }

  public addAsyncStepList(name: string, steps: any[]) {
    return Promise.all([
      this.stepListManager.addAsyncStepList(name, steps),
      this.clientPool.addAsyncStepList(name, steps)
    ]);
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

  private setShell(fileSystem: FileSystem) {
    const shellCommunicator: ShellCommunicator = new ShellCommunicator();
    const thread = new Shell(shellCommunicator);
    thread.addCommand("system-update", "sudo apt-get update");
    thread.addCommand("system-upgrade", "sudo apt-get upgrade -y");
    thread.addCommand("system-restart", "sudo restart now");
    thread.addCommand("system-install", "sudo apt-get install {0} -y");
    thread.addCommand("node-install", "bash " + fileSystem.path("/install"));
    thread.addCommand("node-update", "bash " + fileSystem.path("/update"));
    thread.addCommand("node-clone", "bash " + fileSystem.path("/clone") + " {0} {1}");
    thread.addCommand("node-restart", "sudo systemctl restart deploy");
    this.shell = thread;
  }

  private setDatabase(config: any) {
    const databaseCommunicator: DatabaseCommunicator = new DatabaseCommunicator(config.user, config.password, config.host, config.database);
    const thread = new Database(databaseCommunicator);
    thread.addQuery("current-time", "SELECT NOW() AS currentTime");
    this.database = thread;
  }

  private setStepListManager(shell: Shell, database: Database, clientPool: ClientPool) {
    this.stepListManager = new StepListManager(shell, database, clientPool);
  }

  public addClientThread(host: string, port: number) {
    const clientCommunicator: ClientCommunicator = new ClientCommunicator(host, port);
    this.clientPool.addClient(new Client(clientCommunicator));
  }
}
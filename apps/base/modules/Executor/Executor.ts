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
import { GraphExecutor } from "./GraphExecutor";

export class Executor {

  private shell: Shell;
  private database: Database;
  private clientPool: ClientPool;
  private stepListManager: StepListManager;
  private graphExecutor: GraphExecutor;
  private jobRunner: JobRunner;

  constructor(fileSystem: FileSystem, dbConfig: any, fsConfig: any, clientPool: ClientPool) {
    this.clientPool = clientPool;
    this.setDatabase(dbConfig);
    this.setShell(fileSystem, this.database, fsConfig);
    this.setStepListManager(this.shell, this.database, clientPool);
    this.setGraphExecutor();
  }

  public setJobRunner(jobRunner: JobRunner) {
    this.jobRunner = jobRunner;
  }

  public status(): Promise<any> {
    return Promise.all([
      this.shell.getStatus(),
      this.database.getStatus(),
      this.clientPool.getStatus()
    ]);
  }

  public addExecutable(username: string, userId: number, data: any) {
    switch (data.exe) {
      case "function":
        return this.shell.addProgram(username, userId, data);
      case "query":
        return this.database.addQuery(username, userId, data);
      case "pipe":
      case "async":
      case "foreach":
        return this.stepListManager.addStepList(username, userId, data);
      case "job":
        return this.jobRunner.addJob(username, userId, data);
      case "graph":
        return this.graphExecutor.addGraph(username, userId, data);
    }
  }

  public getExecutable(username: string, name: string, exe: string): Promise<any> {
    return this.hydrateStepJson({name: name, exe: exe, username: username});
  }

  private hydrateStepJson(data: any) {
    return this.database.runQuery("admin", "get-exe-by-type-name", {name: data.name, exe: data.exe, username: data.username})
    .then((result) => {
      let stepJson;
      if (result.length == 0) {
        return;
      } 

      stepJson = result[0];
      switch (stepJson.exe) {
        case "pipe":
        case "async":
          return Promise.all(Lodash.map(stepJson.steps || JSON.parse(stepJson.data), (step) => {
            return this.hydrateStepJson(step);
          })).then((result) => {
            return {
              username: stepJson.username,
              name: stepJson.name,
              exe: stepJson.exe,
              description: stepJson.description,
              input: stepJson.input,
              output: stepJson.output,
              steps: result
            };
          });
        case "eachnode":
        case "foreach":
          return this.hydrateStepJson(stepJson.step || JSON.parse(stepJson.data))
          .then((result) => {
            return {
              username: stepJson.username,
              name: stepJson.name,
              exe: stepJson.exe,
              description: stepJson.description,
              input: stepJson.input,
              output: stepJson.output,
              step: result
            };
          });
        case "function":
          return this.shell.getProgramFile(stepJson.name)
          .then((file) => {
            const data = JSON.parse(stepJson.data);
            return {
              username: stepJson.username,
              name: stepJson.name,
              exe: stepJson.exe,
              description: stepJson.description,
              input: stepJson.input,
              output: stepJson.output,
              text: file,
              args: data.args,
              command: data.command
            };
          });
        case "graph":
          const graph = JSON.parse(stepJson.data);
          return this.hydrateExecutables(graph.nodes)
          .then((nodes) => {
            graph.nodes = nodes;
            return Promise.resolve({
              username: stepJson.username,
              name: stepJson.name,
              exe: stepJson.exe,
              description: stepJson.description,
              input: stepJson.input,
              output: stepJson.output,
              graph: graph,
            });
          });
        case "query":
          return Promise.resolve({
            username: stepJson.username,
            name: stepJson.name,
            exe: stepJson.exe,
            description: stepJson.description,
            input: stepJson.input,
            output: stepJson.output,
            text: stepJson.data,
          });
      }
    });
  }

  private hydrateExecutables(nodes: any[]) {
    return Promise.all(Lodash.map(nodes, (node) => {
      return this.getExecutable(node.username, node.name, node.exe)
      .then((exe) => {
        return Object.assign(node, exe);
      });
    }));
  }

  public getExecutables(username: string, exe: string): Promise<any> {
    switch (exe) {
      case "function":
        return this.shell.getPrograms(username);
      case "query":
        return this.database.getQueries(username);
      case "pipe":
      case "async":
      case "foreach":
        return this.stepListManager.getStepLists(username, exe);
      case "job":
        return this.jobRunner.getJobs(username);
      case "graph":
        return this.graphExecutor.getGraphs(username);
    }
  }

  public runExecutable(username: string, name: string, exe: string, data: any) {
    switch (exe) {
      case "function":
        return this.shell.runProgram(username, name, data);
      case "query":
        return this.database.runQuery(username, name, data);
      case "pipe":
      case "async":
      case "foreach":
        return this.stepListManager.runStepList(username, name, exe, data);
      case "graph":
        return this.graphExecutor.runGraph(name, data);
    }
  }

  public searchExecutables(searchText: string) {
    return this.database.runQuery("admin", "search-executable", {searchText: searchText})
    .then((results) => {
      const groups = {};
      Lodash.each(results, (item) => {
        if (groups[item.exe] == undefined) {
          groups[item.exe] = [];
        }

        groups[item.exe].push(item);
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
    const databaseCommunicator: DatabaseCommunicator = new DatabaseCommunicator(config.user, config.password, config.host, config.port, config.database);
    const thread = new Database(databaseCommunicator);
    this.database = thread;
    return this.database;
  }

  private setStepListManager(shell: Shell, database: Database, clientPool: ClientPool) {
    const thread = new StepListManager(shell, database, clientPool, this);
    this.stepListManager = thread;
    return this.stepListManager;
  }

  private setGraphExecutor() {
    this.graphExecutor = new GraphExecutor(this.database, this, this.stepListManager);
  }

  public addClientThread(host: string, port: number) {
    const clientCommunicator: ClientCommunicator = new ClientCommunicator(host, port);
    this.clientPool.addClient(new Client(clientCommunicator));
  }
}
import { Function } from "./Function";
import { Query } from "./Query";
import { FileSystemCommunicator } from "../Communicator/FileSystemCommunicator";
import { Environment } from "./Environment";
import { Graph } from "./Graph";
import { ShellCommunicator } from "../Communicator/ShellCommunicator";
import { FileSystem } from "../FileSystem/FileSystem";
import { DatabaseCommunicator } from "../Communicator/DatabaseCommunicator";
import { ClientCommunicator } from "../Communicator/ClientCommunicator";
import { FileSystemFactory } from "../FileSystem/FileSystemFactory";

export class ExecutableFactory {

  constructor(
    private fileSystemFactory: FileSystemFactory,
    private fileSystem: FileSystem,
    private shell: ShellCommunicator,
    private database: DatabaseCommunicator) {

  }

  function(data: any): Promise<Function> {
    return this.fileSystemFactory.getUserFileSystem(data.username).getFile(data.username + "/programs", data.name)
    .then((file: string) => {
      const functionData = JSON.parse(data.data)
      return new Function(
        data.username,
        data.name,
        data.visibility,
        functionData.command,
        functionData.args,
        file,
        this.shell,
        this.fileSystem
      )
    });
  }

  query(data: any): Promise<Query> {
    return this.fileSystemFactory.getUserFileSystem(data.username).getFile(data.username + "/queries", data.name)
    .then((file: string) => {
      return new Query(
        data.username,
        data.name,
        data.visibility,
        file,
        this.database
      )
    });
  }

  graph(data: any): Promise<Graph> {
    const graphData = JSON.parse(data.data)
    return Promise.resolve(
      new Graph(
        data.username,
        data.name,
        data.visibility,
        graphData.nodes,
        graphData.edges,
        graphData.foreach,
        this
      )
    )
  }

  environment(data: any): Promise<Environment> {
    return Promise.resolve(new Environment(
      data.username,
      data.name,
      this
    ))
  }
}
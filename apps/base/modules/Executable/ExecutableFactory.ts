import { Function } from "./Function";
import { Query } from "./Query";
import { Graph } from "./Graph";
import { ShellCommunicator } from "../Communicator/ShellCommunicator";
import { FileSystem } from "../FileSystem/FileSystem";
import { DatabaseCommunicator } from "../Communicator/DatabaseCommunicator";
import { FileSystemFactory } from "../FileSystem/FileSystemFactory";
import { EnvironmentClient } from "../Client/EnvironmentClient";

export class ExecutableFactory {

  constructor(
    private fileSystemFactory: FileSystemFactory,
    private fileSystem: FileSystem,
    private shell: ShellCommunicator,
    private database: DatabaseCommunicator,
    private environmentClient: EnvironmentClient) {

  }

  function(data: any): Function {
    return new Function(
      data.username,
      data.name,
      data.visibility,
      data.command,
      data.args,
      data.text,
      this.shell,
      this.environmentClient,
      this.fileSystem
    )
  }

  query(data: any): Query {
    return new Query(
      data.username,
      data.name,
      data.visibility,
      data.text,
      this.database,
      this.environmentClient
    )
  }

  graph(data: any): Graph {
    return new Graph(
      data.username,
      data.name,
      data.visibility,
      data.graph.nodes,
      data.graph.edges,
      data.graph.foreach
    )
  }
}
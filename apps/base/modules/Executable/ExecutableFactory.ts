import { Function } from "./Function";
import { Query } from "./Query";
import { Graph } from "./Graph";
import { ShellCommunicator } from "../Communicator/ShellCommunicator";
import { FileSystem } from "../FileSystem/FileSystem";
import { DatabaseCommunicator } from "../Communicator/DatabaseCommunicator";
import { FileSystemFactory } from "../FileSystem/FileSystemFactory";

export class ExecutableFactory {

  constructor(
    private fileSystemFactory: FileSystemFactory,
    private fileSystem: FileSystem,
    private shell: ShellCommunicator,
    private database: DatabaseCommunicator) {

  }

  function(data: any): Function {
    return new Function(
      data.username,
      data.name,
      data.visibility,
      data.command,
      data.args,
      data.text,
      this.shell
    )
  }

  query(data: any): Query {
    return new Query(
      data.username,
      data.name,
      data.visibility,
      data.text,
      this.database
    )
  }

  graph(data: any): Graph {
    const graphData = data.data
    return new Graph(
      data.username,
      data.name,
      data.visibility,
      graphData.nodes,
      graphData.edges,
      graphData.foreach
    )
  }
}
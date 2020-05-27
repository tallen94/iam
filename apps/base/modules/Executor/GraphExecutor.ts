import * as Lodash from "lodash";
import * as uuid from "uuid";
import { DatabaseCommunicator } from "../Communicator/DatabaseCommunicator";
import { Queries } from "../Constants/Queries";

export class GraphExecutor {

  constructor(private databaseCommunicator: DatabaseCommunicator) { }

  public addGraph(data: any) {
    const trimmedData = JSON.stringify(this.trimData(data.graph));
    return this.getGraph(data.username, data.cluster, data.environment, data.name).then((result) => {
      if (result == undefined) {
        return this.databaseCommunicator.execute(Queries.ADD_EXECUTABLE, {
          username: data.username, 
          name: data.name,
          uuid: uuid.v4(),
          exe: data.exe,
          data: trimmedData,
          input: data.input,
          output: data.output,
          description: data.description,
          environment: data.environment,
          cluster: data.cluster,
          visibility: data.visibility
        })
      }
      return this.databaseCommunicator.execute(Queries.UPDATE_EXECUTABLE, { 
        username: data.username,
        name: data.name,
        exe: data.exe,
        data: trimmedData,
        input: data.input,
        output: data.output,
        description: data.description,
        environment: data.environment,
        cluster: data.cluster,
        visibility: data.visibility
      })
    });
  }

  public getGraph(username: string, cluster: string, environment: string, name: string) {
    return this.databaseCommunicator.execute(Queries.GET_EXE, {
      username: username, 
      cluster: cluster, 
      environment: environment, 
      name: name, 
      exe: 'graph'
    }).then((result: any[]) => {
      if (result.length > 0) {
        const item = result[0];
        const data = JSON.parse(item.data);
        return {
          username: item.username,
          name: item.name,
          exe: item.exe,
          description: item.description,
          input: item.input,
          output: item.output,
          graph: data,
          environment: item.environment,
          cluster: item.cluster,
          visibility: item.visibility
        }
      }
      return Promise.resolve(undefined);
    });
  }

  public deleteGraph(username: string, cluster: string, environment: string, name: string) {
    return this.databaseCommunicator.execute(Queries.DELETE_EXECUTABLE, {username: username, cluster: cluster, environment: environment, name: name, exe: "graph"})
  }

  private trimData(data: any) {
    data.nodes = Lodash.map(data.nodes, (node) => {
      return {
        id: node.id,
        name: node.name,
        exe: node.exe,
        username: node.username,
        foreach: node.foreach,
        cluster: node.cluster,
        environment: node.environment
      };
    });

    data.edges = Lodash.map(data.edges, (edge) => {
      return {
        source: edge.source,
        target: edge.target
      };
    });
    return data;
  }
}
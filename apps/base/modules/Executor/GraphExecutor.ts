import * as Lodash from "lodash";
import * as uuid from "uuid";
import { ExecutableFactory } from "../Executable/ExecutableFactory";
import { Query } from "../Executable/Query";

export class GraphExecutor {

  constructor(private executableFactory: ExecutableFactory) { }

  public addGraph(data: any) {
    const trimmedData = JSON.stringify(this.trimData(data.graph));
    return this.getGraph(data.username, data.name).then((result) => {
      if (result == undefined) {
        return this.executableFactory.query({
          username: "admin", 
          name: "add-exe"
        }).then((query: Query) => {
          return query.run({
            username: data.username, 
            name: data.name,
            uuid: uuid.v4(),
            exe: data.exe,
            data: trimmedData,
            input: data.input,
            output: data.output,
            description: data.description,
            environment: data.environment,
            visibility: data.visibility
          })
        })
      }
      return this.executableFactory.query({
        username: "admin", 
        name: "update-exe"
      }).then((query: Query) => {
        return query.run({ 
          name: data.name,
          exe: data.exe,
          data: trimmedData,
          input: data.input,
          output: data.output,
          description: data.description,
          environment: data.environment,
          visibility: data.visibility
        })
      })
    });
  }

  public getGraph(username: string, name: string) {
    return this.executableFactory.query({
      username: "admin", 
      name: "get-exe-by-type-name"
    }).then((query: Query) => {
      return query.run({ username: username, name: name, exe: "graph" })
    }).then((result) => {
      if (result.length > 0) {
        const item = result[0];
        item.data = JSON.parse(item.data);
        return item;
      }
      return Promise.resolve(undefined);
    });
  }

  private trimData(data: any) {
    data.nodes = Lodash.map(data.nodes, (node) => {
      return {
        id: node.id,
        name: node.name,
        exe: node.exe,
        username: node.username,
        foreach: node.foreach
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
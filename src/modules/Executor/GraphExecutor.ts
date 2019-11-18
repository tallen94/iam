import { Database } from "./Database";
import * as Lodash from "lodash";
import { Node } from "../Graph/Node";
import { DirectedGraph } from "../Graph/DirectedGraph";
import { Executor } from "./Executor";
import { StepListManager } from "../Step/StepListManager";
import * as UUID from "uuid";

export class GraphExecutor {

  constructor(
    private database: Database,
    private executor: Executor,
    private stepListManager: StepListManager) { }

  public addGraph(username: string, userId: number, data: any) {
    const trimmedData = this.trimData(data.graph);
    return this.getGraph(data.username, data.name).then((result) => {
      if (result == undefined) {
        return this.database.runQuery("admin", "add-exe", {
          username: username,
          name: data.name,
          uuid: UUID.v4(),
          exe: data.exe,
          data: JSON.stringify(trimmedData),
          input: data.input,
          output: data.output,
          userId: userId,
          description: data.description
        });
      } else {
        return this.database.runQuery("admin", "update-exe", {
          name: data.name,
          exe: data.exe,
          data: JSON.stringify(trimmedData),
          input: data.input,
          output: data.output,
          description: data.description
        });
      }
    });
  }

  public getGraph(username: string, name: string) {
    return this.database.runQuery("admin", "get-exe-by-type-name", { username: username, name: name, exe: "graph"})
    .then((result) => {
      if (result.length > 0) {
        const item = result[0];
        item.data = JSON.parse(item.data);
        return item;
      }
      return Promise.resolve(undefined);
    });
  }

  public runGraph(name: string, data: any) {
    return this.database.runQuery("admin", "get-exe-by-type-name", { name: name, exe: "graph"})
    .then((result) => {
      if (result.length > 0) {
        const item = result[0];
        const graphData = JSON.parse(item.data);
        return this.buildGraph(graphData.nodes, graphData.edges)
        .then((graph) => {
          return graph.execute(data);
        });
      }
      return Promise.resolve(undefined);
    });
  }

  public getGraphs(username: string) {
    return this.database.runQuery("admin", "get-exe-for-user", {exe: "graph", username: username})
    .then((data) => {
      return Promise.all(Lodash.map(data, (item) => {
        return {
          username: item.username,
          name: item.name,
          description: item.description
        };
      }));
    });
  }

  private getSteps(nodes: any[]) {
    return Promise.all(Lodash.map(nodes,
      (node) => this.executor.getExecutable(node.username, node.name, node.exe))
      .map((nodePromise) => {
        return nodePromise.then((node) => {
          return this.stepListManager.stepJsonToStep(node);
        });
      }));
  }

  private buildGraph(nodes: any[], edges: any[]) {
    return this.getSteps(nodes)
    .then((steps) => {
      const nodeList = Lodash.map(steps, (step) => {
        return new Node([], [], step);
      });

      Lodash.each(edges, (edge) => {
        const source = edge.source - 1;
        const target = edge.target - 1;
        if (nodeList[target] != undefined) {
          nodeList[target].addParent(nodeList[source]);
        }
        if (nodeList[source] != undefined) {
          nodeList[source].addChild(nodeList[target]);
        }
      });
      return new DirectedGraph(nodeList);
    });
  }

  private trimData(data: any) {
    data.nodes = Lodash.map(data.nodes, (node) => {
      return {
        id: node.id,
        name: node.name,
        exe: node.exe,
        username: node.username
      };
    });
    return data;
  }
}
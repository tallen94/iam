import { Database } from "./Database";
import * as Lodash from "lodash";
import { Node } from "../Graph/Node";
import { DirectedGraph } from "../Graph/DirectedGraph";
import { Executor } from "./Executor";
import { StepListManager } from "../Step/StepListManager";

export class GraphExecutor {

  constructor(
    private database: Database,
    private executor: Executor,
    private stepListManager: StepListManager) { }

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

  public getGraphs(username: string, userId: number) {
    return this.database.runQuery("admin", "get-exe-for-user", {exe: "graph", userId: userId, username: username})
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
        if (nodeList[edge.target] != undefined) {
          nodeList[edge.target].addParent(nodeList[edge.source]);
        }
        if (nodeList[edge.source] != undefined) {
          nodeList[edge.source].addChild(nodeList[edge.target]);
        }
      });
      return new DirectedGraph(nodeList);
    });
  }
}
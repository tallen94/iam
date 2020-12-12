import { Executable } from "./Executable";
import { DirectedGraph } from "../Graph/DirectedGraph";
import { Node } from "../Graph/Node";
import * as Lodash from "lodash";
import { Query } from "./Query";
import { ClientCommunicator } from "../Communicator/ClientCommunicator";
import { ProgramStep } from "../Step/ProgramStep";
import { Client } from "../Client/Client";
import { AuthData } from "../Auth/AuthData";

export class Graph implements Executable {

  constructor(
    private username: string,
    private name: string,
    private visibility: string,
    private nodes: any[],
    private edges: any[],
    private foreach: boolean
  ) {

  }

  public getUsername() {
    return this.username
  }

  public getName(): string {
    return this.name
  }

  public getVisibility(): string {
    return this.visibility
  }

  public run(data: any, authData: AuthData): Promise<any> {
    return this.buildGraph(this.nodes, this.edges)
    .then((directedGraph: DirectedGraph) => {
      if (this.foreach) {
        return this.runForeach(directedGraph, data, authData)
      }
      return directedGraph.execute(data, authData);
    });
  }

  private runForeach(directedGraph: DirectedGraph, data: any, authData: AuthData) {
    const numThreads = 2;
    const threads = [];
    const results = [];

    for (let index = 0; index < data.length; index++) {
      if (threads.length < numThreads) {
        threads.push(Promise.resolve().then(() => {
          return directedGraph.execute(data[index], authData)
          .then((result: any) => {
            results.push(result);
          })
        }))
      } else {
        threads[index % numThreads] = threads[index % numThreads]
        .then(() => {
          return directedGraph.execute(data[index], authData)
          .then((result: any) => {
            results.push(result);
          })
        })
      }
    }
    return Promise.all(threads).then(() => {
      return results;
    })
  }

  private buildGraph(nodes: any[], edges: any[]): Promise<DirectedGraph> {
    return this.getSteps(nodes)
    .then((steps) => {
      const indexedNodes = {}
      Lodash.each(steps, (step, i) => {
        const node = new Node([], [], step)
        indexedNodes[nodes[i].id] = node;
      });

      Lodash.each(edges, (edge) => {
        const source = edge.source;
        const target = edge.target;
        if (indexedNodes[target] != undefined) {
          indexedNodes[target].addParent(indexedNodes[source]);
        }
        if (indexedNodes[source] != undefined) {
          indexedNodes[source].addChild(indexedNodes[target]);
        }
      });
      return new DirectedGraph(Lodash.values(indexedNodes));
    });
  }

  private getSteps(nodes: any[]) {
    return Promise.all(Lodash.map(nodes, (node) => {
      const host = process.env.ROUTER_HOST
      const clientCommunicator: ClientCommunicator = new ClientCommunicator(host, parseInt(process.env.ROUTER_PORT))
      const client: Client = new Client(clientCommunicator);
      return new ProgramStep(node, client, node.foreach);
    }))
  }
}
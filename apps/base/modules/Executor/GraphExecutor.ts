import { Database } from "./Database";
import * as Lodash from "lodash";
import { Node } from "../Graph/Node";
import { DirectedGraph } from "../Graph/DirectedGraph";
import * as UUID from "uuid";
import { ClientCommunicator } from "../Communicator/ClientCommunicator";
import { Client } from "./Client";
import { ProgramStep } from "../Step/ProgramStep";
import { QueryStep } from "../Step/QueryStep";
import { Shell } from "./Shell";

export class GraphExecutor {

  constructor(
    private database: Database,
    private shell: Shell) { }

  public addGraph(data: any) {
    const trimmedData = this.trimData(data.graph);
    return this.getGraph(data.username, data.name).then((result) => {
      if (result == undefined) {
        return this.database.runQuery("admin", "add-exe", {
          username: data.username,
          name: data.name,
          uuid: UUID.v4(),
          exe: data.exe,
          data: JSON.stringify(trimmedData),
          input: data.input,
          output: data.output,
          userId: data.userId,
          description: data.description,
          environment: data.environment
        });
      } else {
        return this.database.runQuery("admin", "update-exe", {
          name: data.name,
          exe: data.exe,
          data: JSON.stringify(trimmedData),
          input: data.input,
          output: data.output,
          description: data.description,
          environment: data.environment
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

  public runGraph(username: string, name: string, data: any) {
    return this.database.runQuery("admin", "get-exe-by-type-name", {username: username, name: name, exe: "graph"})
    .then((result) => {
      if (result.length > 0) {
        const item = result[0];
        const graphData = JSON.parse(item.data);
        return this.buildGraph(graphData.nodes, graphData.edges)
        .then((graph) => {
          if (graphData.foreach) {
            const numThreads = 2;
            const threads = [];
            const results = [];

            for (let index = 0; index < data.length; index++) {
              if (threads.length < numThreads) {
                threads.push(Promise.resolve().then(() => {
                  return graph.execute(data[index])
                  .then((result: any) => {
                    results.push(result);
                  })
                }))
              } else {
                threads[index % numThreads] = threads[index % numThreads]
                .then(() => {
                  return graph.execute(data[index])
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
    return Promise.all(Lodash.map(nodes, (node) => {
      switch (node.exe) {
        case "function":
          return this.shell.getProgram(node.username, node.name)
        case "query":
          return this.database.getQuery(node.username, node.name);
      }
    }).map((nodePromise, index) => {
      return nodePromise.then((node) => {
        node.foreach = nodes[index].foreach
        return this.database.runQuery("admin", "get-exe-environment", {username: node.username, exe: node.exe, name: node.name})
        .then((results) => {
          if (results.length > 0) {
            const env = JSON.parse(results[0].data)
            const clientCommunicator = new ClientCommunicator(env.host, env.port)
            const client = new Client(clientCommunicator);
            return this.stepJsonToStep(node, client);
          }
        })
      });
    }));
  }

  private buildGraph(nodes: any[], edges: any[]) {
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

  public stepJsonToStep(stepJson, client?: Client) {
    switch (stepJson.exe) {
      case "function":
        return new ProgramStep(stepJson.username, stepJson.name, this.shell, client, stepJson.foreach);
      case "query":
        return new QueryStep(stepJson.username, stepJson.name, this.database, client, stepJson.foreach);
    }
  }
}
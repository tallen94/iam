import * as Lodash from "lodash";
import { Node } from "./Node";

export class DirectedGraph {

  constructor(
    private nodes: Node[]
  ) {}

  public execute(data: any[]) {
    // Starting nodes have no parents
    const startNodes = Lodash.filter(this.nodes, (node) => node.numParents() == 0);

    // Leaf nodes have no children
    const leafNodes = Lodash.filter(this.nodes, (node) => node.numChildren() == 0);

    // Other nodes have parents. Does include leaf nodes.
    const other = Lodash.filter(this.nodes, (node) => node.numParents() > 0);

    // Begin execution by calling execute on all nodes without parents
    Lodash.each(startNodes, (node, i) => node.execute(data[i]));

    // Continue execution by calling execute for remaining nodes
    // These will wait for parent execution before executing
    Lodash.each(other, (node) => node.execute());

    // Return results from all leaf nodes
    return Promise.all(Lodash.map(leafNodes, (node) => node.getPromise()));
  }
}
import { Step } from "../Step/Step";
import * as Lodash from "lodash";

export class Node {

  private promise: Promise<any>;

  constructor(
    private parents: Node[],
    private children: Node[],
    private step: Step
  ) {}

  public execute(data?: any) {
    if (this.parents.length > 0) {
      this.promise = Promise.all(Lodash.map(this.parents, (parent) => parent.getPromise()))
      .then((results) => {
        return this.step.execute(results, false);
      });
    } else {
      this.promise = this.step.execute(data, false);
    }
  }

  public getPromise() {
    return this.promise;
  }

  public numParents() {
    return this.parents.length;
  }

  public numChildren() {
    return this.children.length;
  }

  public addParent(node: Node) {
    this.parents.push(node);
  }

  public addChild(node: Node) {
    this.children.push(node);
  }
}
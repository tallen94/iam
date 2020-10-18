import { Step } from "../Step/Step";
import * as Lodash from "lodash";
import e = require("express");
import { AuthData } from "../Auth/AuthData";

export class Node {

  private promise: Promise<any>;

  constructor(
    private parents: Node[],
    private children: Node[],
    private step: Step
  ) {}

  public execute(data: any, authData: AuthData) {
    if (this.parents.length == 1) {
      this.promise = this.parents[0].getPromise().then((result) => {
        return this.step.execute(result, authData);
      });
    } else if (this.parents.length > 1) {
      this.promise = Promise.all(Lodash.map(this.parents, (parent) => parent.getPromise()))
      .then((results) => {
        return this.step.execute(results, authData);
      });
    } else {
      this.promise = this.step.execute(data, authData);
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
import { Step } from "./Step";
import Lodash from "lodash";
import { Shell } from "../Executor/Shell";
import { StepList } from "./StepList";
import { ExecutableFactory } from "../Executable/ExecutableFactory";
import { Function } from "../Executable/Function";

export class ForEachStep implements Step {

  private step: Step;
  private groupSize: number;
  private shell: Shell;
  private executableFactory: ExecutableFactory;

  constructor(step: Step, groupSize: number, shell: Shell) {
    this.step = step;
    this.groupSize = groupSize;
    this.shell = shell;
  }

  public execute(data: any[]) {
    // return this.executableFactory.function({
    //   username: "admin", 
    //   name: "group-data"
    // }).then((fn: Function) => {
    //   return fn.run({n: this.groupSize, data: data})
    // }).then((groups) => {
    //   let promise = Promise.resolve([]);
    //   Lodash.each(groups, (dataList) => {
    //     promise = promise.then((results) => {
    //       return Promise.all(Lodash.map(dataList, (item) => {
    //         return this.step.execute(item, "");
    //       })).then((results2) => {
    //         return results.concat(results2);
    //       });
    //     });
    //   });
    //   return promise;
    // });
  }

  public executeEach(data: any[]) {
    // return this.executableFactory.function({
    //   username: "admin", 
    //   name: "group-data"
    // }).then((fn: Function) => {
    //   return fn.run({n: this.groupSize, data: data})
    // }).then((groups) => {
    //   let promise = Promise.resolve([]);
    //   Lodash.each(groups, (dataList) => {
    //     promise = promise.then((results) => {
    //       return Promise.all(Lodash.map(dataList, (item) => {
    //         return this.step.execute(item, "");
    //       })).then((results2) => {
    //         return results.concat(results2);
    //       });
    //     });
    //   });
    //   return promise;
    // });
  }

  private wait(seconds: number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, seconds * 1000);
    });
  }
}
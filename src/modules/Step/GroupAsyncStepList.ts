import { Step } from "./Step";
import Lodash from "lodash";
import { Shell } from "../Executor/Shell";
import { StepList } from "./StepList";

export class GroupAsyncStepList implements StepList {

  private step: Step;
  private numGroups: number;
  private shell: Shell;

  constructor(step: Step, numGroups: number, shell: Shell) {
    this.step = step;
    this.numGroups = numGroups;
    this.shell = shell;
  }

  /**
   * Group a list of data. Run each group in parallel but each item in each group, sequentially.
   * @param data
   */
  public execute(data: any[]) {
    return this.shell.runProgram("group-data", {n: data.length / this.numGroups, data: data})
    .then((groups) => {
      return Promise.all(Lodash.map(groups, (group) => {
        return this.step.execute(group);
      }));
    });
  }

  public executeEach(data: any[]) {
    return this.shell.runProgram("group-data", {n: data.length / this.numGroups, data: data})
    .then((groups) => {
      return Promise.all(Lodash.map(groups, (group) => {
        return this.step.execute(group);
      }));
    });
  }
}
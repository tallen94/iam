import { Step } from "./Step";
import { StepList } from "./StepList";
import Lodash from "lodash";

export class AsyncStepList implements StepList {

  private steps: Step[];

  constructor(steps: Step[]) {
    this.steps = steps;
  }

  public execute(data: any[]) {
    return Promise.all(Lodash.map(this.steps, (step, i) => {
      return step.execute(data[i]);
    }));
  }
}
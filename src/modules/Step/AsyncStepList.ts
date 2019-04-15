import { Step } from "./Step";
import { StepList } from "./StepList";
import Lodash from "lodash";

export class AsyncStepList implements StepList {

  private steps: Step[];

  constructor() {
    this.steps = [];
  }

  public addStep(step: Step) {
    this.steps.push(step);
  }

  public execute(data: any[]) {
    return Promise.all(Lodash.map(this.steps, (step, i) => {
      return step.execute(data[i]);
    }));
  }
}
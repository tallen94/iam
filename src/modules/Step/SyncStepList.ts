import { StepList } from "./StepList";
import { Step } from "./Step";
import Lodash from "lodash";

export class SyncStepList implements StepList {

  private steps: Step[];

  constructor() {
    this.steps = [];
  }

  public addStep(step: Step) {
    this.steps.push(step);
  }

  public execute(data: any) {
    let promise = Promise.resolve(data);
    Lodash.each(this.steps, (step) => {
      promise = promise.then((result) => {
        return step.execute(result);
      });
    });
    return promise;
  }
}
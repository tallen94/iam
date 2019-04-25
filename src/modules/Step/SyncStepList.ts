import { Step } from "./Step";
import Lodash from "lodash";

export class SyncStepList implements Step {

  private steps: Step[];

  constructor(steps: Step[]) {
    this.steps = steps;
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
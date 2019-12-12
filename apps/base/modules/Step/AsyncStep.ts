import { Step } from "./Step";
import { StepList } from "./StepList";
import Lodash from "lodash";
import { CollectDuplex } from "../Stream/CollectDuplex";

export class AsyncStep implements Step {

  private steps: Step[];

  constructor(steps: Step[]) {
    this.steps = steps;
  }

  // public spawn() {
  //   const processes = Lodash.map(this.steps, (step) => step.spawn());
  //   return this.buildPipe(processes);
  // }

  private buildPipe(processes) {
    let pipe = processes[0].stdout()
      .pipe(new CollectDuplex({objectMode: true}));
    for (let i = 1; i < processes.length; i++) {
      pipe = pipe.pipe(processes[i].stdout().pipe(new CollectDuplex({objectMode: true})));
    }
    return pipe;
  }

  public execute(data: any[]) {
    return Promise.all(Lodash.map(this.steps, (step, i) => {
      return step.execute(data[i], false)
      .then((result) => {
        return result;
      });
    }));
  }

  // public executeEach(data: any) {
  //   return Promise.all(Lodash.map(this.steps, (step, i) => {
  //     return step.executeEach(data[i]);
  //   }));
  // }
}
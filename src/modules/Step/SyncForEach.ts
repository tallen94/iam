import { Step } from "./Step";
import { StepList } from "./StepList";
import Lodash from "lodash";
import { CollectDuplex } from "../Stream/CollectDuplex";

export class SyncForEachStep implements Step {

  private step: Step;

  constructor(step: Step) {
    this.step = step;
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
    let promise = Promise.resolve([]);
    Lodash.each(data, (item) => {
      promise = promise.then((resultList) => {
        return this.step.execute(item)
        .then((result) => {
          resultList.push(result);
          return resultList;
        });
      });
    });
    return promise;
  }

  public executeEach(data: any[]) {
    let promise = Promise.resolve([]);
    Lodash.each(data, (item) => {
      promise = promise.then((resultList) => {
        return this.step.executeEach(item)
        .then((result) => {
          resultList.push(result);
          return resultList;
        });
      });
    });
    return promise;
  }
}
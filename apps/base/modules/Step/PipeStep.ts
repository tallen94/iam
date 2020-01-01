import { Step } from "./Step";
import { StepList } from "./StepList";
import Lodash from "lodash";
import { Process } from "../Process/Process";
import { GenericDuplex } from "../Stream/GenericDuplex";
import { LocalProcess } from "../Process/LocalProcess";
import { RemoteProcess } from "../Process/RemoteProcess";
import { QueryProcess } from "../Process/QueryProcess";

export class PipeStep implements Step {

  private steps: Step[];

  constructor(steps: Step[]) {
    this.steps = steps;
  }

  // public spawn() {
  //   // let first = this.steps[0].spawn();
  //   // let second = this.steps[1].spawn();
  //   // let third = this.steps[2].spawn();
  //   // let last = this.steps[3].spawn();
  //   //
  //   // read.pipe(first.write)
  //   // first.read.pipe(second.write)
  //   // second.read.pipe(third.write)
  //   // third.read.pipe(last.write)
  //   // last.read.pipe(write)
  //   //
  //   // first.pipeReadWrite(read, second.write);
  //   // second.pipeReadWrite(first.read, third.write);
  //   // third.pipeReadWrite(second.read, last.write);
  //   // last.pipeReadWrite(third.read, write);
  //   // const processes = Lodash.map(this.steps, (step) => step.spawn());
  //   // return this.buildPipe(processes)
  //   // .pipe(new GenericDuplex({objectMode: true}));
  //   return null;
  // }

  private buildPipe(processes: LocalProcess[] | RemoteProcess[] | QueryProcess[]) {
    for (let i = 0; i < processes.length - 1; i++) {
      processes[i].stdout().pipe(processes[i + 1].stdin());
    }
    return processes[processes.length - 1].stdout();
  }

  public execute(data: any) {
    let promise = Promise.resolve(data);
    Lodash.each(this.steps, (step) => {
      promise = promise.then((result) => {
        return step.execute(result, true);
      });
    });
    return promise;
  }

  // public executeEach(data: any) {
  //   let promise = Promise.resolve(data);
  //   Lodash.each(this.steps, (step) => {
  //     promise = promise.then((result) => {
  //       return step.executeEach(result);
  //     });
  //   });
  //   return promise;
  // }
}
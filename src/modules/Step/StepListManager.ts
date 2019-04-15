import Lodash from "lodash";
import { SyncStepList } from "./SyncStepList";
import { AsyncStepList } from "./AsyncStepList";
import { CommandStep } from "./CommandStep";
import { ProgramStep } from "./ProgramStep";
import { QueryStep } from "./QueryStep";
import { StepList } from "./StepList";
import { Shell } from "../Executor/Shell";
import { Database } from "../Executor/Database";
import { ClientPool } from "../Executor/ClientPool";

export class StepListManager {
  private stepLists: { [key: string]: StepList };
  private shell: Shell;
  private database: Database;
  private clientPool: ClientPool;

  constructor(shell: Shell, database: Database, clientPool: ClientPool) {
    this.shell = shell;
    this.database = database;
    this.clientPool = clientPool;
    this.stepLists = {};
  }

  public execute(name: string, data: any) {
    return this.stepLists[name].execute(data);
  }

  public addSyncStepList(name: string, steps: any[]) {
    const stepList = new SyncStepList();
    this.stepLists[name] = this.addSteps(stepList, steps);
  }

  public addAsyncStepList(name: string, steps: any[]) {
    const stepList = new AsyncStepList();
    this.stepLists[name] = this.addSteps(stepList, steps);
  }

  private addSteps(stepList: StepList, steps: any[]): StepList {
    Lodash.each(steps, (stepInfo) => {
      switch (stepInfo.type) {
        case "COMMAND":
          stepList.addStep(new CommandStep(stepInfo.name, this.shell, this.clientPool));
          break;
        case "PROGRAM":
          stepList.addStep(new ProgramStep(stepInfo.name, this.shell, this.clientPool));
          break;
        case "QUERY":
          stepList.addStep(new QueryStep(stepInfo.name, this.database, this.clientPool));
          break;
        case "STEP_LIST":
          stepList.addStep(this.stepLists[stepInfo.name]);
          break;
      }
    });
    return stepList;
  }
}
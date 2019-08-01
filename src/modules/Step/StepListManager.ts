import Lodash from "lodash";
import { SyncStepList } from "./SyncStepList";
import { AsyncStepList } from "./AsyncStepList";
import { CommandStep } from "./CommandStep";
import { ProgramStep } from "./ProgramStep";
import { QueryStep } from "./QueryStep";
import { Shell } from "../Executor/Shell";
import { Database } from "../Executor/Database";
import { ClientPool } from "../Executor/ClientPool";
import { Duplex } from "stream";
import { ForEachStep } from "./ForEachStep";
import { MeteredForEachStep } from "./MeteredStepList";
import { GroupAsyncStepList } from "./GroupAsyncStepList";
import { SyncForEachStep } from "./SyncForEach";
import { EachNodeStep } from "./EachNodeStep";

export class StepListManager {
  private shell: Shell;
  private database: Database;
  private clientPool: ClientPool;

  constructor(shell: Shell, database: Database, clientPool: ClientPool) {
    this.shell = shell;
    this.database = database;
    this.clientPool = clientPool;
  }

  // ADD
  public addStepList(name: string, data: string, dataType: string, dataModel: string, userId: number, description: string) {
    return this.getStepList(name)
    .then((result) => {
      if (result == undefined) {
        return this.database.runQuery("add-exe", {
          name: name,
          type: "STEPLIST",
          data: data,
          dataType: dataType,
          dataModel: dataModel,
          userId: userId,
          description: description
        });
      } else {
        return this.database.runQuery("update-exe", {
          name: name,
          type: "STEPLIST",
          data: data,
          dataType: dataType,
          dataModel: dataModel,
          userId: userId,
          description: description
        });
      }
    });
  }

  // GET ONE SYNC
  public getStepList(name: string) {
    return this.database.runQuery("get-exe-by-type-name", {type: "STEPLIST", name: name})
    .then((result) => {
      if (result.length > 0) {
        const item = result[0];
        return {
          name: item.name,
          data: JSON.parse(item.data),
          dataType: item.dataType,
          dataModel: item.dataModel,
          description: item.description
        };
      }
      return undefined;
    });
  }

  // GET ALL SYNC
  public getStepLists(userId: number) {
    return this.database.runQuery("get-exe-for-user", {type: "STEPLIST", userId: userId})
    .then((result) => {
      return Lodash.map(result, (item) => {
        return {name: item.name, description: item.description};
      });
    });
  }

  public runStepList(name: string, data: any) {
    return this.stepJsonToStep({name: name, type: "STEPLIST"})
    .then((step) => {
      return step.execute(data);
    });
  }

  public spawn(name: string): Duplex {
    // const stepList = <StepList> this.stepJsonToStep(this.stepLists[name].data);
    // return stepList.spawn();
    return null;
  }

  private stepJsonToStep(stepJson: any) {
    switch (stepJson.type) {
      case "COMMAND":
        return Promise.resolve(new CommandStep(stepJson.name, this.shell, this.clientPool));
      case "PROGRAM":
        return Promise.resolve(new ProgramStep(stepJson.name, this.shell, this.clientPool));
      case "QUERY":
        return Promise.resolve(new QueryStep(stepJson.name, this.database, this.clientPool));
      case "STEPLIST":
        return this.getStepList(stepJson.name).then((stepList) => {
          if (stepList != undefined) {
            stepJson = stepList.data;
          }

          if (stepJson.async == "true") {
            return Promise.all(Lodash.map(stepJson.steps, (item) => {
              return this.stepJsonToStep(item);
            })).then((steps) => {
              return new AsyncStepList(steps);
            });
          }

          if (stepJson.async == "false") {
            return Promise.all(Lodash.map(stepJson.steps, (item) => {
              return this.stepJsonToStep(item);
            })).then((steps) => {
              return new SyncStepList(steps);
            });
          }

          if (stepJson.async == "foreach") {
            return this.stepJsonToStep(stepJson.step)
            .then((step) => {
              return new ForEachStep(step);
            });
          }

          if (stepJson.async == "metered") {
            return this.stepJsonToStep(stepJson.step)
            .then((step) => {
              return new MeteredForEachStep(step, stepJson.groupSize, this.shell);
            });
          }

          if (stepJson.async == "syncforeach") {
            return this.stepJsonToStep(stepJson.step)
            .then((step) => {
              return new SyncForEachStep(step);
            });
          }

          if (stepJson.async == "eachnode") {
            return this.stepJsonToStep(stepJson.step)
            .then((step) => {
              return new EachNodeStep(step);
            });
          }

          if (stepJson.async == "groupasync") {
            return this.stepJsonToStep(stepJson.step)
            .then((step) => {
              return new GroupAsyncStepList(step, stepJson.numGroups, this.shell);
            });
          }
        });
    }
  }
}
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

export class StepListManager {
  private shell: Shell;
  private database: Database;
  private clientPool: ClientPool;

  constructor(shell: Shell, database: Database, clientPool: ClientPool) {
    this.shell = shell;
    this.database = database;
    this.clientPool = clientPool;
  }

  public loadData() {
    return this.getStepLists();
  }

  // ADD
  public addStepList(name: string, data: string, dataType: string, dataModel: string, userId: number) {
    return this.getStepList(name)
    .then((result) => {
      if (result == undefined) {
        return this.database.runQuery("add-exe", {
          name: name,
          type: "STEPLIST",
          data: data,
          dataType: dataType,
          dataModel: dataModel,
          userId: userId
        });
      } else {
        return this.database.runQuery("update-exe", {
          name: name,
          type: "STEPLIST",
          data: data,
          dataType: dataType,
          dataModel: dataModel,
          userId: userId
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
          data: JSON.parse(unescape(item.data)),
          dataType: item.dataType,
          dataModel: unescape(item.dataModel)
        };
      }
      return undefined;
    });
  }

  // GET ALL SYNC
  public getStepLists() {
    return this.database.runQuery("get-exe-by-type", {type: "STEPLIST"})
    .then((result) => {
      return Lodash.map(result, (item) => {
        return {name: item.name};
      });
    });
  }

  public runStepList(name: string, data: any) {
    return this.getStepList(name).then((stepList) => {
      stepList.data["type"] = "STEPLIST";
      return this.stepJsonToStep(stepList.data);
    }).then((step) => {
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
            return this.stepJsonToStep(stepList.data);
          }

          if (stepJson.async == "true") {
            return Promise.all(Lodash.map(stepJson.steps, (item) => {
              return this.stepJsonToStep(item);
            })).then((steps) => {
              return new AsyncStepList(steps);
            });
          }

          if (stepJson.async == "foreach") {
            return this.stepJsonToStep(stepJson.step)
            .then((step) => {
              return new ForEachStep(step);
            });
          }

          return Promise.all(Lodash.map(stepJson.steps, (item) => {
            return this.stepJsonToStep(item);
          })).then((steps) => {
            return new SyncStepList(steps);
          });
        });
    }
  }
}
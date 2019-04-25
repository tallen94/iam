import Lodash from "lodash";
import { SyncStepList } from "./SyncStepList";
import { AsyncStepList } from "./AsyncStepList";
import { CommandStep } from "./CommandStep";
import { ProgramStep } from "./ProgramStep";
import { QueryStep } from "./QueryStep";
import { Shell } from "../Executor/Shell";
import { Database } from "../Executor/Database";
import { ClientPool } from "../Executor/ClientPool";

export class StepListManager {
  private stepLists: { [key: string]: any };
  private shell: Shell;
  private database: Database;
  private clientPool: ClientPool;

  constructor(shell: Shell, database: Database, clientPool: ClientPool) {
    this.shell = shell;
    this.database = database;
    this.clientPool = clientPool;
    this.stepLists = {};
  }

  public loadData() {
    return this.getStepLists();
  }

  // ADD
  public addStepList(name: string, async: boolean, steps: any[]) {
    const data = { type: "STEPLIST", async: async, steps: steps };
    return this.getStepList(name)
    .then((result) => {
      if (result == undefined) {
        return this.database.runQuery("add-exe", {
          name: name,
          type: "STEPLIST",
          data: escape(JSON.stringify(data))
        });
      } else {
        return this.database.runQuery("update-exe", {
          name: name,
          type: "STEPLIST",
          data: escape(JSON.stringify(data))
        });
      }
    }).then((result) => {
      this.stepLists[name] = data;
      return this.stepLists[name];
    });
  }

  // GET ONE SYNC
  public getStepList(name: string) {
    return this.database.runQuery("get-exe-by-type-name", {type: "STEPLIST", name: name})
    .then((result) => {
      if (result.length > 0) {
        const item = result[0];
        this.stepLists[item.name] = JSON.parse(unescape(item.data));
        return this.stepLists[item.name];
      }
    });
  }

  // GET ALL SYNC
  public getStepLists() {
    return this.database.runQuery("get-exe-by-type", {type: "STEPLIST"})
    .then((result) => {
      Lodash.each(result, (item) => {
        const data = JSON.parse(unescape(item.data));
        this.stepLists[item.name] = data;
      });
      return this.stepLists;
    });
  }

  public runStepList(name: string, data: any) {
    const step = this.stepJsonToStep(this.stepLists[name]);
    return step.execute(data);
  }

  private stepJsonToStep(stepJson: any) {
    switch (stepJson.type) {
      case "COMMAND":
        return new CommandStep(stepJson.name, this.shell, this.clientPool);
      case "PROGRAM":
        return new ProgramStep(stepJson.name, this.shell, this.clientPool);
      case "QUERY":
        return new QueryStep(stepJson.name, this.database, this.clientPool);
      case "STEPLIST":
        if (this.stepLists[stepJson.name] == undefined) {
          if (stepJson.async == "true") {
            return new AsyncStepList(Lodash.map(stepJson.steps, (item) => {
              return this.stepJsonToStep(item);
            }));
          }
          return new SyncStepList(Lodash.map(stepJson.steps, (item) => {
            return this.stepJsonToStep(item);
          }));
        }
        return this.stepJsonToStep(this.stepLists[stepJson.name]);
    }
  }
}
import Lodash from "lodash";
import { ProgramStep } from "./ProgramStep";
import { QueryStep } from "./QueryStep";
import { Duplex } from "stream";
import { Shell } from "../Executor/Shell";
import { Database } from "../Executor/Database";
import * as UUID from "uuid";
import { Executor } from "../Executor/Executor";
import { Client } from "../Executor/Client";

export class StepListManager {
  constructor(private shell: Shell, private database: Database, private executor: Executor) {
  }

  // ADD
  public addStepList(data: any) {
    const trimmedData = this.trimStepJson(data);
    return this.getStepList(data.username, data.name, data.exe)
    .then((result) => {
      if (result == undefined) {
        return this.database.runQuery("admin", "add-exe", {
          username: data.username,
          name: data.name,
          uuid: UUID.v4(),
          exe: data.exe,
          data: JSON.stringify(trimmedData.steps || trimmedData.step),
          input: data.input,
          output: data.output,
          userId: data.userId,
          description: data.description
        });
      } else {
        return this.database.runQuery("admin", "update-exe", {
          name: data.name,
          exe: data.exe,
          data: JSON.stringify(trimmedData.steps || trimmedData.step),
          input: data.input,
          output: data.output,
          userId: data.userId,
          description: data.description
        });
      }
    });
  }

  // GET ONE SYNC
  public getStepList(username, name: string, exe: string) {
    return this.database.runQuery("admin", "get-exe-by-type-name", {exe: exe, name: name, username: username})
    .then((result) => {
      if (result.length > 0) {
        const item = result[0];
        const data = JSON.parse(item.data);
        const ret = {
          username: item.username,
          name: item.name,
          exe: item.exe,
          data: data,
          input: item.input,
          description: item.description
        };
        return ret;
      }
      return Promise.resolve(undefined);
    });
  }

  // GET ALL SYNC
  public getStepLists(username: string, exe: string) {
    return this.database.runQuery("admin", "get-exe-for-user", {exe: exe, username: username})
    .then((data) => {
      return Promise.all(Lodash.map(data, (item) => {
        return this.database.runQuery("admin", "search-steplists", {query: "%name\":\"" + item.name + "\"%"})
        .then((results) => {
          return {
            username: item.username,
            name: item.name,
            description: item.description,
            steplists: results
          };
        });
      }));
    });
  }

  public runStepList(username: string, name: string, exe: string, data: any) {
    return this.executor.getExecutable(username, name, exe)
    .then((stepList) => {
      const step = this.stepJsonToStep(stepList);
      return step.execute(data);
    });
  }

  public spawn(name: string): Duplex {
    // const stepList = <StepList> this.stepJsonToStep(this.stepLists[name].data);
    // return stepList.spawn();
    return null;
  }

  public stepJsonToStep(stepJson, client?: Client) {
    switch (stepJson.exe) {
      case "function":
        return new ProgramStep(stepJson.username, stepJson.name, this.shell, client, stepJson.foreach);
      case "query":
        return new QueryStep(stepJson.username, stepJson.name, this.database, client, stepJson.foreach);
    }
  }

  private trimStepJson(data: any) {
    switch (data.exe) {
      case "async":
      case "pipe":
        return { username: data.username, exe: data.exe, name: data.name, steps: Lodash.map(data.steps, (step) => {
            return this.trimStepJson(step);
          })
        };
      case "foreach":
        return { username: data.username, exe: data.exe, name: data.name, step: this.trimStepJson(data.step) };
      default:
          return { username: data.username, exe: data.exe, name: data.name };
    }
  }
}
import Lodash from "lodash";
import { ProgramStep } from "./ProgramStep";
import { Duplex } from "stream";
import * as uuid from "uuid";
import { Executor } from "../Executor/Executor";
import { Client } from "../Executor/Client";
import { ExecutableFactory } from "../Executable/ExecutableFactory";
import { Query } from "../Executable/Query";

export class StepListManager {
  constructor(private executor: Executor, private executableFactory: ExecutableFactory) {
  }

  // ADD
  public addStepList(data: any) {
    const trimmedData = this.trimStepJson(data);
    return this.getStepList(data.username, data.name, data.exe)
    .then((result) => {
      if (result == undefined) {
        return this.executableFactory.query({
          username: "admin", 
          name: "add-exe"
        }).then((query: Query) => {
          return query.run({
            username: data.username, 
            name: data.name,
            uuid: uuid.v4(),
            exe: data.exe,
            data: trimmedData,
            input: data.input,
            output: data.output,
            description: data.description,
            environment: data.environment,
            visibility: data.visibility
          })
        })
      }
      return this.executableFactory.query({
        username: "admin", 
        name: "update-exe"
      }).then((query: Query) => {
        return query.run({ 
          name: data.name,
          exe: data.exe,
          data: trimmedData,
          input: data.input,
          output: data.output,
          description: data.description,
          environment: data.environment,
          visibility: data.visibility
        })
      })
    });
  }

  // GET ONE SYNC
  public getStepList(username, name: string, exe: string) {
    return this.executableFactory.query({
      username: "admin", 
      name: "get-exe-by-type-name"
    }).then((query: Query) => {
      return query.run({ username: username, name: name, exe: "steplist" })
    }).then((result) => {
      if (result.length > 0) {
        const item = result[0];
        const data = JSON.parse(item.data);
        const ret = {
          username: item.username,
          name: item.name,
          exe: item.exe,
          data: data,
          input: item.input,
          description: item.description,
          visibility: item.visibility
        };
        return ret;
      }
      return Promise.resolve(undefined);
    });
  }

  // GET ALL SYNC
  public getStepLists(username: string, exe: string) {
    return this.executableFactory.query({
      username: "admin", 
      name: "get-exe-for-user"
    }).then((query: Query) => {
      return query.run({ exe: "steplist", username: username })
    }).then((data) => {
      return Promise.all(Lodash.map(data, (item) => {
        return this.executableFactory.query({
          username: "admin", 
          name: "search-steplists"
        }).then((query: Query) => {
          return query.run({query: "%name\":\"" + item.name + "\"%"})
        }).then((results) => {
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
      return step.execute(data, "");
    });
  }

  public spawn(name: string): Duplex {
    // const stepList = <StepList> this.stepJsonToStep(this.stepLists[name].data);
    // return stepList.spawn();
    return null;
  }

  public stepJsonToStep(stepJson, client?: Client) {
    return new ProgramStep(stepJson.username, stepJson.name, client, stepJson.exe, stepJson.foreach);
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
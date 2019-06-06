import { Executor } from "../Executor/Executor";

import * as Lodash from "lodash";

export class JobRunner {

  private state: string;
  private executor: Executor;

  constructor(executor: Executor) {
    this.executor = executor;
    this.state = "STOPPED";
    this.run();
    this.queue();
  }

  private run() {
    setTimeout(() => {
      if (this.state == "RUNNING") {
        this.dequeue().then((job) => {
          if (job != undefined) {
            const data = JSON.parse(unescape(job.data)).data;
            this.executor.runExecutable(data.exeType, data.exeName, JSON.parse(data.data))
            .then((result) => {
              return this.ack(job.id);
            }).catch((result) => {
              return this.requeue(job.id);
            });
          }
        });
      }
      this.run();
    }, 500);
  }

  public queue() {
    setTimeout(() => {
      this.getJobs().then((jobs) => {
        Lodash.each(jobs, (job) => {
          if (job.data.enabled == "1") {
            this.executor.runExecutable("PROGRAM", "next-date", { cronExpr: job.data.cronExpr })
            .then((date) => {
              const diff = Math.abs(Date.now() - date);
              if (diff <= 2000) {
                this.executor.getDatabase().runQuery("queue-job", { data: escape(JSON.stringify(job)) });
              }
            });
          }
        });
      });
      this.queue();
    }, 1000);
  }

  public addJob(name: string, data: string, dataType: string, dataModel: string, userId: number) {
    return this.getJob(name).then((result) => {
      if (result == undefined) {
        return this.executor.getDatabase().runQuery("add-exe", {
          name: name,
          type: "JOB",
          data: data,
          dataType: dataType,
          dataModel: dataModel,
          userId: userId
        });
      }
      return this.executor.getDatabase().runQuery("update-exe", {
        name: name,
        type: "JOB",
        data: data,
        dataType: dataType,
        dataModel: dataModel,
        userId: userId
      });
    });
  }

  public getJob(name: string) {
    return this.executor.getDatabase().runQuery("get-exe-by-type-name", { type: "JOB", name: name})
    .then((result) => {
      if (result.length > 0) {
        const item = result[0];
        return {
          name: item.name,
          data: JSON.parse(unescape(item.data)),
          dataType: item.dataType,
          dataModel: unescape(item.dataModel),
        };
      }
      return undefined;
    });
  }

  public getJobs() {
    return this.executor.getDatabase().runQuery("get-exe-by-type", {type: "JOB"})
    .then((result) => {
      return Lodash.map(result, (item) => {
        return {
          name: item.name,
          data: JSON.parse(unescape(item.data)),
          dataType: item.dataType,
          dataModel: unescape(item.dataModel),
        };
      });
    });
  }

  private ack(id: number) {
    return this.executor.getDatabase().runQuery("ack-job", {id: id});
  }

  private requeue(id: number) {
    return this.executor.getDatabase().runQuery("requeue-job", {id: id});
  }

  private dequeue() {
    return this.executor.getDatabase().runQuery("get-n-jobs", {})
    .then((result) => {
      result = result[3];
      if (result.length > 0) {
        return result[0];
      }
      return undefined;
    });
  }

  public start() {
    this.state = "RUNNING";
  }

  public stop() {
    this.state = "STOPPED";
  }
}
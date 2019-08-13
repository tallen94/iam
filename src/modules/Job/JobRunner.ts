import { Executor } from "../Executor/Executor";

import * as Lodash from "lodash";
import * as UUID from "uuid";

export class JobRunner {

  private state: string;
  private executor: Executor;

  constructor(executor: Executor) {
    this.executor = executor;
    this.state = "STOPPED";
    // this.queue();
    // this.run();
  }

  /**
   * Pull from the queue and run jobs.
   */
  private run() {
    setTimeout(() => {
      if (this.state == "RUNNING") {
        this.dequeue(5)
        .then((jobs) => {
          Lodash.each(jobs, (job) => {
            const data = JSON.parse(job.data);
            this.executor.runExecutable(data.exeType, data.exeName, JSON.parse(data.data))
            .then((result) => {
              return this.ack(job.id);
            }).then((result) => {
              return this.executor.runExecutable("QUERY", "get-exe-by-id", {id: job.jobId})
              .then((result) => {
                if (result.length > 0) {
                  const item = result[0];
                  const jobData = JSON.parse(item.data);
                  if (jobData.enabled == "1") {
                    this.queueJob(job.jobId, data);
                  }
                }
              });
            });
          });
        });
      }
      this.run();
    }, 5000);
  }

  /**
   * Pull all jobs from the database and attempt to queue them.
   * Only performed once on startup.
   */
  public queue() {
    this.getAllJobs().then((jobs) => {
      Lodash.each(jobs, (job) => {
        if (job.data.enabled == "1") {
          this.queueJob(job.id, job.data);
        }
      });
    });
  }

  public addJob(name: string, data: string, dataType: string, dataModel: string, userId: number, description: string) {
    return this.getJob(name).then((result) => {
      if (result == undefined) {
        return this.executor.getDatabase().runQuery("add-exe", {
          name: name,
          type: "JOB",
          data: data,
          dataType: dataType,
          dataModel: dataModel,
          userId: userId,
          description: description
        });
      }
      return this.executor.getDatabase().runQuery("update-exe", {
        name: name,
        type: "JOB",
        data: data,
        dataType: dataType,
        dataModel: dataModel,
        userId: userId,
        description: description
      });
    }).then((result) => {
      return this.getJob(name);
    }).then((job) => {
      if (job.data.enabled == "1") {
        this.queueJob(job.id, job.data);
      }
    });
  }

  public getJob(name: string) {
    return this.executor.getDatabase().runQuery("get-exe-by-type-name", { type: "JOB", name: name})
    .then((result) => {
      if (result.length > 0) {
        const item = result[0];
        return {
          id: item.id,
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

  public getJobs(userId: number) {
    return this.executor.getDatabase().runQuery("get-exe-for-user", {type: "JOB", userId: userId})
    .then((data) => {
      return Promise.all(Lodash.map(data, (item) => {
        return this.executor.getDatabase().runQuery("search-steplists", {query: "%name\":\"" + item.name + "\"%"})
        .then((results) => {
          return {
            name: item.name,
            description: item.description,
            steplists: results
          };
        });
      }));
    });
  }

  public getAllJobs() {
    return this.executor.getDatabase().runQuery("get-exe-by-type", {type: "JOB"})
    .then((result) => {
      return Lodash.map(result, (item) => {
        return {
          id: item.id,
          name: item.name,
          data: JSON.parse(item.data),
          dataType: item.dataType,
          dataModel: item.dataModel,
          description: item.description
        };
      });
    });
  }

  private ack(id: number) {
    return this.executor.getDatabase().runQuery("ack-job", {id: id});
  }

  private queueJob(jobId: number, data: any) {
    return this.executor.runExecutable("PROGRAM", "next-date", { cronExpr: data.cronExpr })
    .then((date) => {
      this.executor.getDatabase().runQuery("queue-job", { date: date , data: JSON.stringify(data), jobId: jobId });
    });
  }

  private dequeue(size: number) {
    return this.executor.runExecutable("STEPLIST", "dequeue-jobs", { table: UUID.v4(), size: size})
    .catch((reason) => {
      process.exit();
    });
  }

  public start() {
    this.state = "RUNNING";
  }

  public stop() {
    this.state = "STOPPED";
  }
}
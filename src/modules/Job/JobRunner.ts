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
    // setTimeout(() => {
    //   if (this.state == "RUNNING") {
    //     this.dequeue(5)
    //     .then((jobs) => {
    //       Lodash.each(jobs, (job) => {
    //         const data = JSON.parse(job.data);
    //         this.executor.runExecutable(data.exeType, data.exeName, data.exeType, JSON.parse(data.data))
    //         .then((result) => {
    //           return this.ack(job.id);
    //         }).then((result) => {
    //           return this.executor.runExecutable("mysql", "get-exe-by-id", "mysql", {id: job.jobId})
    //           .then((result) => {
    //             if (result.length > 0) {
    //               const item = result[0];
    //               const jobData = JSON.parse(item.data);
    //               if (jobData.enabled == "1") {
    //                 this.queueJob(job.jobId, data);
    //               }
    //             }
    //           });
    //         });
    //       });
    //     });
    //   }
    //   this.run();
    // }, 5000);
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

  public addJob(username: string, userId: number, data: any) {
    return this.getJob(data.name)
    .then((result) => {
      if (result == undefined) {
        return this.executor.getDatabase().runQuery("admin", "add-exe", {
          username: username,
          name: data.name,
          uuid: UUID.v4(),
          exe: data.exe,
          data: data.data,
          input: data.input,
          output: data.output,
          userId: userId,
          description: data.description
        });
      }
      return this.executor.getDatabase().runQuery("admin", "update-exe", {
        name: data.name,
        exe: data.exe,
        data: data.data,
        input: data.input,
        output: data.output,
        userId: userId,
        description: data.description
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
    return this.executor.getDatabase().runQuery("admin", "get-exe-by-type-name", { exe: "job", name: name})
    .then((result) => {
      if (result.length > 0) {
        const item = result[0];
        const data = JSON.parse(item.data);
        const ret = {
          id: item.id,
          name: item.name,
          exe: item.exe,
          data: data,
          input: item.input,
          output: item.output,
          description: item.description
        };
        Lodash.each(data, (value, key) => {
          ret[key] = value;
        });
      }
      return Promise.resolve(undefined);
    });
  }

  public getJobs(userId: number) {
    return this.executor.getDatabase().runQuery("admin", "get-exe-for-user", {exe: "job", userId: userId})
    .then((data) => {
      return Promise.all(Lodash.map(data, (item) => {
        return this.executor.getDatabase().runQuery("admin", "search-steplists", {query: "%name\":\"" + item.name + "\"%"})
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
    return this.executor.getDatabase().runQuery("admin", "get-exe-by-type", {exe: "job"})
    .then((result) => {
      return Lodash.map(result, (item) => {
        return {
          id: item.id,
          name: item.name,
          data: item.data,
          input: item.input,
          description: item.description
        };
      });
    });
  }

  private ack(id: number) {
    return this.executor.getDatabase().runQuery("admin", "ack-job", {id: id});
  }

  private queueJob(jobId: number, data: any) {
    // return this.executor.runExecutable("PROGRAM", "next-date", "python", { cronExpr: data.cronExpr })
    // .then((date) => {
    //   this.executor.getDatabase().runQuery("queue-job", { date: date , data: JSON.stringify(data), jobId: jobId });
    // });
  }

  private dequeue(size: number) {
    // return this.executor.runExecutable("pipe", "dequeue-jobs", "python", { table: UUID.v4(), size: size})
    // .catch((reason) => {
    //   process.exit();
    // });
  }

  public start() {
    this.state = "RUNNING";
  }

  public stop() {
    this.state = "STOPPED";
  }
}
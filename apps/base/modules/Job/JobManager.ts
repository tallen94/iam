import { DatabaseCommunicator } from "../Communicator/DatabaseCommunicator";
import { Queries } from "../Constants/Queries";
import { Templates } from "../Constants/Templates";
import { FileSystemCommunicator } from "../Communicator/FileSystemCommunicator";
import { FileSystem } from "../FileSystem/FileSystem";
import { ShellCommunicator } from "../Communicator/ShellCommunicator";
import { Functions } from "../Constants/Functions";
import * as Lodash from "lodash";
import uuid from "uuid";

export class JobManager {

  constructor(
    private databaseCommunicator: DatabaseCommunicator,
    private fileSystemCommunicator: FileSystemCommunicator,
    private shellCommunicator: ShellCommunicator,
    private fileSystem: FileSystem) { }

  public addJob(data: any) {
    return this.getJob(data.username, data.name)
    .then((result) => {
      if (result == undefined) {
        return this.databaseCommunicator.execute(Queries.ADD_JOB, {
          name: data.name,
          username: data.username, 
          description: data.description,
          enabled: data.enabled,
          schedule: data.schedule,
          jobData: data.jobData,
          executable: JSON.stringify(data.executable)
        })
      }
      return this.databaseCommunicator.execute(Queries.UPDATE_JOB, {
        name: data.name,
        username: data.username, 
        description: data.description,
        enabled: data.enabled,
        schedule: data.schedule,
        jobData: data.jobData,
        executable: JSON.stringify(data.executable)
      })
    }).then(() => {
      const jobFile = this.replace(Templates.JOB, {
        name: this.jobFullName(data.username, data.name),
        schedule: data.schedule,
        data: data.jobData,
        exeUser: data.executable.user,
        exeCluster: data.executable.cluster,
        exeEnvironment: data.executable.environment,
        exeType: data.executable.exe,
        exeName: data.executable.name
      })
      return this.fileSystemCommunicator.putFile("job", {
        name: this.jobFullName(data.username, data.name),
        file: jobFile
      })
    });
  }

  public getJob(username: string, name: string) {
    return this.databaseCommunicator.execute(Queries.GET_JOB, {
      username: username,
      name: name
    }).then((result) => {
      if (result.length > 0) {
        const item = result[0];
        item.jobData = item.jobData;
        item.executable = JSON.parse(item.executable);
        return item;
      }
      return undefined;
    });
  }

  public getJobsForUser(username: string) {
    return this.databaseCommunicator.execute(Queries.GET_JOBS_FOR_USER, {username: username})
    .then((results: any[]) => {
      return Promise.all(Lodash.map(results, (item) => {
        item.jobData = item.jobData
        item.executable = JSON.parse(item.executable)
        return item;
      }))
    })
  }

  public deleteJob(username: string, name: string) {
    return this.databaseCommunicator.execute(Queries.DELETE_JOB, { username: username, name: name })
  }

  public enableJob(username: string, name: string) {
    return this.getJob(username, name)
    .then((job) => {
      return this.fileSystemCommunicator.getFile("job", this.jobFullName(username, name))
      .then((file) => {
        const fileUid = uuid.v4()
        return this.fileSystem.put("run", fileUid, file)
        .then(() => {
          return this.shellCommunicator.exec(Functions.KUBECTL_APPLY, "bash", "{file}", {
            file: this.fileSystem.path("run/" + fileUid)
          })
        }).then((result) => {
          if (result.err) {
            return { result: result.err, enabled: false }
          }
          job.enabled = true;
          return this.addJob(job)
          .then((result) => {
            return this.fileSystem.delete(this.fileSystem.path("run/" + fileUid))
          }).then(() => {
            return { result: result, enabled: true }
          })
        })
      })
    })
  }

  public disableJob(username: string, name: string) {
    return this.getJob(username, name)
    .then((job) => {
      return this.fileSystemCommunicator.getFile("job", this.jobFullName(username, name))
      .then((file) => {
        const fileUid = uuid.v4()
        return this.fileSystem.put("run", fileUid, file)
        .then(() => {
          return this.shellCommunicator.exec(Functions.KUBECTL_DELETE, "bash", "{file}", {
            file: this.fileSystem.path("run/" + fileUid)
          })
        }).then((result) => {
          if (result.err) {
            return { result: result.err, enabled: true }
          }
          job.enabled = false;
          return this.addJob(job)
          .then((result) => {
            return this.fileSystem.delete(this.fileSystem.path("run/" + fileUid))
          }).then(() => {
            return { result: result, enabled: false }
          })
        })
      })
    })
  }

  private replace(s: string, data: any): string {
    Lodash.each(data, (value, key) => {
      const re = new RegExp("{" + key + "}", "g");
      s = s.replace(re, value);
    });
    return s;
  }

  private jobFullName(username: string, name: string) {
    return [username, name].join("-")
  } 
}
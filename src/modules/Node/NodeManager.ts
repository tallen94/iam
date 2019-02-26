import * as Lodash from "lodash";
import { Node, Job } from "../modules";

export class NodeManager {

  private node: Node;

  constructor(node: Node) {
    this.node = node;
  }

  public status(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.recurse(id, () => {
        resolve([]);
      }, (id: number) => {
        this.node.getNext().getStatus(id)
        .then((outList: any[]) => {
          resolve(Lodash.concat(outList, this.node.getStatus()));
        });
      });
    });
  }

  public getJob(jobId: string, id: number) {
    return new Promise((resolve, reject) => {
      this.recurse(id, () => {
        resolve([]);
      }, (id: number) => {
        this.node.getNext().getJob(jobId, id)
        .then((outList: any[]) => {
          resolve(Lodash.concat(outList, this.node.getJob(jobId)));
        });
      });
    });
  }

  public update(pkg: any, id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.recurse(id, () => {
        resolve("Updated. Restarting Now.");
      }, (id: number) => {
        const promises: Promise<Job>[] = [this.node.runCommand("node-update", []), this.node.getNext().update(pkg, id)];
        Promise.all(promises);
        resolve("Updated. Restarting Now.");
      });
    });
  }

  public clone(address: string): Promise<any> {
    return this.node.runCommand("node-clone", [this.node.getFileSystem().getRoot(), address]);
  }

  public addProgram(programName: string, command: string, filename: string, program: any, id: number): Promise<any>  {
    return new Promise((resolve, reject) => {
      this.recurse(id, () => {
        resolve("Added program");
      }, (id: number) => {
        this.node.addProgram(programName, command, filename);
        this.node.getNext().addProgram(programName, command, filename, program, id)
        .then(() => {
          resolve("Added program");
        });
      });
    });
  }

  public runProgram(programName: string, args: string[], threads: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const promises: Promise<Job>[] = [this.node.runProgram(programName, args)];
      if (threads > 1) {
        promises.push(this.node.getNext().runProgram(programName, args, threads - 1));
      }

      Promise.all(promises)
      .then((resultList: Job[]) => {
        if (resultList.length == 1) {
          resolve(resultList);
        } else {
          const nodeResult = resultList[0];
          const nextResult = resultList[1];
          resolve(Lodash.concat(nextResult, nodeResult));
        }
      });
    });
  }

  public runPrograms(programName: string, argsList: string[][]): Promise<any> {
    return new Promise((resolve, reject) => {
      const promises: Promise<Job>[] = [this.node.runProgram(programName, argsList.shift())];
      if (argsList.length >= 1) {
        promises.push(this.node.getNext().runPrograms(programName, argsList));
      }

      Promise.all(promises)
      .then((resultList: Job[]) => {
        if (resultList.length == 1) {
          resolve(resultList);
        } else {
          const nodeResult = resultList[0];
          const nextResult = resultList[1];
          resolve(Lodash.concat(nextResult, nodeResult));
        }
      });
    });
  }

  public addCommand(commandName: string, command: string, id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.recurse(id, () => {
        resolve("Added command");
      }, (id: number) => {
        this.node.addCommand(commandName, command);
        return this.node.getNext().addCommand(commandName, command, id)
        .then(() => {
          resolve("Added command");
        });
      });
    });
  }

  public runCommand(commandName: string, args: string[], threads: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const promises: Promise<Job>[] = [this.node.runCommand(commandName, args)];
      if (threads > 1) {
        promises.push(this.node.getNext().runCommand(commandName, args, threads - 1));
      }

      Promise.all(promises)
      .then((resultList: Job[]) => {
        if (resultList.length == 1) {
          resolve(resultList);
        } else {
          const nodeResult = resultList[0];
          const nextResult = resultList[1];
          resolve(Lodash.concat(nextResult, nodeResult));
        }
      });
    });
  }

  public runCommands(commandName: string, argsList: string[][]): Promise<any> {
    return new Promise((resolve, reject) => {
      const promises: Promise<Job>[] = [this.node.runCommand(commandName, argsList.shift())];
      if (argsList.length >= 1) {
        promises.push(this.node.getNext().runCommands(commandName, argsList));
      }

      Promise.all(promises)
      .then((resultList: Job[]) => {
        if (resultList.length == 1) {
          resolve(resultList);
        } else {
          const nodeResult = resultList[0];
          const nextResult = resultList[1];
          resolve(Lodash.concat(nextResult, nodeResult));
        }
      });
    });
  }

  public getNode(): Node {
    return this.node;
  }

  private recurse(id: number, terminal: () => void, next: (thread: number) => void) {
    if (id == this.node.getId()) {
      terminal();
    } else {
      if (id == undefined) {
        id = this.node.getId();
      }
      next(id);
    }
  }
}
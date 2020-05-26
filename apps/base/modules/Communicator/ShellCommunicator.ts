import Shell from "shelljs";
import uuid from "uuid";
import * as Lodash from "lodash";
import { FileSystem } from "../FileSystem/FileSystem";

export class ShellCommunicator {

  private processes = {}

  constructor(private fileSystem: FileSystem) { }
  
  public exec(file: string, command: string, args: string, data: any): Promise<any> {
    const tmpName = uuid.v4()
    return this.fileSystem.put("run", tmpName, file)
    .then((err: any) => {
      if (err) {
        return err;
      }
      const path = this.fileSystem.path("run/" + tmpName);
      let run = command + " " + path;
      if (args != "") {
        const replacedArgs = this.replace(args, data);
        run = run + " " + replacedArgs;
      }
      return this._exec(run, JSON.stringify(data))
      .then((result: any) => {
        this.fileSystem.delete("run/" + tmpName)
        try {
          return JSON.parse(result);
        } catch {
          return result;
        }
      }).catch((result) => {
        return {err: result}
      });
    })
  }

  public createProcess(command) {
    const pid = uuid.v4()
    return {
      pid: pid,
      promise: new Promise((resolve, reject) => {
        this.processes[pid] = Shell.exec(command, { silent: true }, (code: number, out: string, err: any) => { });
        let out = "";
        this.processes[pid].stdout.on("data", (data: string) => {
          out = out + data;
        });

        this.processes[pid].stderr.on("data", (data: string) => {
          out = out + data;
        });

        this.processes[pid].on("close", (code, signal) => {
          this.processes[pid].closed = true
          resolve(out);
        });
      })
    };
  }

  public pipeProcess(pid: string, data: string) {
    if (data != undefined && !this.processes[pid].closed) {
      this.processes[pid].stdin.write(data + "\n");
    }
  }

  private _exec(command: string, data?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const cp = Shell.exec(command, { silent: true }, (code: number, out: string, err: any) => { });

      if (data != undefined) {
        cp.stdin.write(data + "\n");
      }

      let out = "";
      cp.stdout.on("data", (data: string) => {
        out = out + data;
      });

      cp.stderr.on("data", (data: string) => {
        out = out + data;
      });

      cp.on("close", (code, signal) => {
        if (code !== 0) {
          reject(out)
        }
        resolve(out);
      });
    });
  }

  private replace(s: string, data: any): string {
    const re = new RegExp("{root}", "g");
    s = s.replace(re, this.fileSystem.getRoot());
    Lodash.each(data, (value, key) => {
      const re = new RegExp("{" + key + "}", "g");
      s = s.replace(re, value);
    });
    return s;
  }
}
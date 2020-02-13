import Shell from "shelljs";
import uuid from "uuid";

export class ShellCommunicator {

  private processes = {}

  constructor() { }

  public exec(command: string, data?: string): Promise<any> {
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
        resolve(out);
      });
    });
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
}
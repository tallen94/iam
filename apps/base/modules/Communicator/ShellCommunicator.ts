import Shell from "shelljs";
import { LocalProcess } from "../Process/LocalProcess";

export class ShellCommunicator {

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
}
import Shell from "shelljs";

export class ShellCommunicator {

  constructor() { }

  public exec(command: string, data?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const cp = Shell.exec(command, { silent: false }, (code: number, out: string, err: any) => {});
      cp.stdin.write(data + "\n");

      let out = "";
      cp.stdout.on("data", (data: string) => {
        out = out + data;
        if (data.endsWith("EOF\n")) {
          out = out.substr(0, out.length - 4);
          resolve(out);
        }
      });
      cp.stderr.on("data", (data: string) => {
        resolve(data);
      });
    });
  }
}
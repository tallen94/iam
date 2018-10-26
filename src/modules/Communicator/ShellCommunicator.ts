import Shell from "shelljs";

export class ShellCommunicator {

  constructor() { }

  public exec(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      Shell.exec(command, { silent: false }, (code: number, out: string, err: any) => {
        resolve(out);
      });
    });
  }
}
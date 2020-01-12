import { Process } from "./Process";
import { ChildProcess, spawn } from "child_process";
import { Readable, Writable } from "stream";
import { WriteStream } from "../Stream/WriteStream";

export class LocalProcess implements Process {

  private command: string;
  private args: any[];
  private child: ChildProcess;

  constructor(command: string, args: any[]) {
    this.command = command;
    this.args = args;
  }

  public spawn() {
    this.child = spawn(this.command, this.args, { detached: true, stdio: ["pipe", "pipe", "pipe"] });
  }

  public pipeReadWrite(read: Readable, write: Writable) {
    this.spawn();
    read.pipe(this.stdin());
    this.stdout().pipe(write);
  }

  public pipeProcess(process: Process) {
    this.spawn();
    process.stdout().pipe(this.stdin());
    this.stdout().pipe(process.stdin());
  }

  public stdin() {
    return this.child.stdin;
  }

  public stdout() {
    return this.child.stdout;
  }

  private watch() {
    this.child.stdout.on("data", (data: string) => {
      console.log("stdout " + data.toString());
    });

    this.child.stderr.on("data", (data: string) => {
      console.log("stderr " + data.toString());
    });

    this.child.on("close", (code: number, signal: string) => {
      console.log("CLOSE - code: " + code + " signal: " + signal );
    });
  }
}
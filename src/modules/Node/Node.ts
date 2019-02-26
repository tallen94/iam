import {
  NodeClient,
  NodeShell,
  FileSystem,
  Job,
  CommandJob,
  ProgramJob
} from "../modules";

import Path from "path";

export class Node {
  private id: number;
  private status: string;
  private shell: NodeShell;
  private next: NodeClient;
  private commands: any;
  private programs: any;
  private fileSystem: FileSystem;
  private jobs: { [key: string]: Job };

  constructor(
    id: number,
    shell: NodeShell,
    next: NodeClient,
    fileSystem: FileSystem
  ) {
    this.id = id;
    this.status = "OK";
    this.shell = shell;
    this.next = next;
    this.fileSystem = fileSystem;
    this.commands = {};
    this.programs = {};
    this.jobs = {};
    this.addDefaults();
  }

  public addDefaults() {
    this.addCommand("system-update", "sudo apt-get update");
    this.addCommand("system-upgrade", "sudo apt-get upgrade -y");
    this.addCommand("system-restart", "sudo restart now");
    this.addCommand("system-install", "sudo apt-get install {0} -y");
    this.addCommand("node-install", "bash " + Path.join(this.fileSystem.getRoot(), "install"));
    this.addCommand("node-update", "bash " + Path.join(this.fileSystem.getRoot(), "update"));
    this.addCommand("node-clone", "bash " + Path.join(this.fileSystem.getRoot(), "clone"));
    this.addCommand("node-restart", "sudo systemctl restart deploy");
    this.addCommand("node-save-config", "echo '{0}' > " + Path.join(this.fileSystem.getRoot(), "config.json"));
   }

  public getId(): number {
    return this.id;
  }

  public getStatus(): string {
    return this.status;
  }

  public getNext(): NodeClient {
    return this.next;
  }

  public getJobs(): { [key: string]: Job } {
    return this.jobs;
  }

  public getJob(id: string) {
    return this.jobs[id];
  }

  public addCommand(name: string, command: string) {
    this.commands[name] = command;
  }

  public runCommand(name: string, args: string[]): Promise<Job> {
    const command = this.commands[name];
    const job = new CommandJob(command);
    this.jobs[job.getId()] = job;
    this.jobs[job.getId()].start();
    return this.shell.exec(command, args).then((result: string) => {
      this.jobs[job.getId()].setResult(result);
      this.jobs[job.getId()].complete();
      return this.jobs[job.getId()];
    });
  }

  public addProgram(name: string, command: string, filename: string): void {
    this.programs[name] = {
      programName: name,
      command: command,
      filename: filename
    };
  }

  public runProgram(name: string, args: string[]): Promise<Job> {
    const program = this.programs[name];
    const path = Path.join(this.fileSystem.getRoot(), program.filename);
    const runString = program.command + " " + path + " " + args.join(" ");
    const job = new ProgramJob(program);
    this.jobs[job.getId()] = job;
    this.jobs[job.getId()].start();
    return this.shell.exec(runString).then((result: string) => {
      this.jobs[job.getId()].setResult(result);
      this.jobs[job.getId()].complete();
      return this.jobs[job.getId()];
    });
  }

  public getFileSystem(): FileSystem {
    return this.fileSystem;
  }
}
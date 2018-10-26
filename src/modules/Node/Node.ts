import {
  NodeClient,
  NodeShell,
  FileSystem
} from "../modules";

import Path from "path";
import Multer from "multer";

export class Node {
  private id: number;
  private status: string;
  private shell: NodeShell;
  private next: NodeClient;
  private commands: any;
  private programs: any;
  private fileSystem: FileSystem;

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

  public addCommand(name: string, command: string) {
    this.commands[name] = command;
  }

  public runCommand(name: string, args: string[]): Promise<string> {
    const command = this.commands[name];
    return this.shell.exec(command, args);
  }

  public addProgram(name: string, command: string, filename: string): void {
    this.programs[name] = {
      programName: name,
      command: command,
      filename: filename
    };
  }

  public runProgram(name: string, args: string[]): Promise<string> {
    const program = this.programs[name];
    const path = Path.join(this.fileSystem.getRoot(), program.filename);
    const runString = program.command + " " + path + " " + args.join(" ");
    return this.shell.exec(runString);
  }

  public getFileSystem(): FileSystem {
    return this.fileSystem;
  }
}
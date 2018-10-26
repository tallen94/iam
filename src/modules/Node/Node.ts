import {
  NodeClient,
  NodeShell,
  FileSystem
} from "../modules";

import Path, { dirname } from "path";
import Multer from "multer";
import { pathMatch } from "tough-cookie";

export class Node {
  private id: number;
  private status: string;
  private shell: NodeShell;
  private next: NodeClient;
  private commands: any;
  private programs: any;
  private stack: Promise<any>;
  private imageFileSystem: FileSystem;
  private programFileSystem: FileSystem;
  private configFileSystem: FileSystem;

  constructor(
    id: number,
    shell: NodeShell,
    next: NodeClient,
    imageFileSystem: FileSystem,
    programFileSystem: FileSystem,
    configFileSystem: FileSystem
  ) {
    this.id = id;
    this.status = "OK";
    this.shell = shell;
    this.next = next;
    this.imageFileSystem = imageFileSystem;
    this.programFileSystem = programFileSystem;
    this.commands = {};
    this.programs = {};
    this.stack = Promise.resolve();
    this.addDefaults();
  }

  public addDefaults() {
    this.addCommand("system-update", "sudo apt-get update");
    this.addCommand("system-upgrade", "sudo apt-get upgrade -y");
    this.addCommand("system-restart", "sudo restart now");
    this.addCommand("node-install", "sudo npm i -g " + Path.join(this.imageFileSystem.getRoot(), "deploy.tgz"));
    this.addCommand("node-restart", "sudo systemctl restart deploy");
   }

  public getId(): number {
    return this.id;
  }

  public getStatus(): string {
    return this.status;
  }

  public setStatus(status: string) {
    this.status = status;
  }

  public getNext(): NodeClient {
    return this.next;
  }

  public runCommand(name: string, args: string[]): Promise<string> {
    const command = this.getCommand(name);
    return this.shell.command(command, args);
  }

  public addCommand(name: string, command: string) {
    this.commands[name] = command;
  }

  public getCommand(name: string): string {
    return this.commands[name];
  }

  public getCommands(): any {
    return this.commands;
  }

  public runProgram(name: string, args: string[]): Promise<string> {
    const program = this.getProgram(name);
    const path = Path.join(this.programFileSystem.getRoot(), program.filename);
    const runString = program.command + " " + path + " " + args.join(" ");
    return this.shell.command(runString);
  }

  public addProgram(name: string, command: string, filename: string): void {
    this.programs[name] = {
      programName: name,
      command: command,
      filename: filename
    };
  }

  public getProgram(name: string): any {
    return this.programs[name];
  }

  public getShell(): NodeShell {
    return this.shell;
  }

  public getStack(): Promise<any> {
    return this.stack;
  }

  public addToStack(promise: Promise<any>) {
    this.stack = this.stack.then((status) => {
      return promise;
    });
  }

  public getImageFileSystem(): Multer.StorageEngine {
    return this.imageFileSystem.getStorage();
  }

  public getProgramFileSystem(): Multer.StorageEngine {
    return this.programFileSystem.getStorage();
  }
}
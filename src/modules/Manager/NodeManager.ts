import * as Lodash from "lodash";
import { Node, FileSystem } from "../modules";
import Path from "path";

export class NodeManager {

  private fileSystem: FileSystem;
  private nodeList: Node[];

  constructor(fileSystem: FileSystem, nodeLocal: Node) {
    this.fileSystem = fileSystem;
    this.nodeList = [nodeLocal];
    this.addDefaults();
  }

  private addDefaults() {
    this.addCommand("system-update", "sudo apt-get update");
    this.addCommand("system-upgrade", "sudo apt-get upgrade -y");
    this.addCommand("system-restart", "sudo restart now");
    this.addCommand("system-install", "sudo apt-get install {0} -y");
    this.addCommand("node-install", "bash " + this.getAbsolutePath("bin/install"));
    this.addCommand("node-update", "bash " + this.getAbsolutePath("bin/update"));
    this.addCommand("node-clone", "bash " + this.getAbsolutePath("bin/clone") + " {0} {1}");
    this.addCommand("node-restart", "sudo systemctl restart deploy");
   }

  public addNode(node: Node): void {
    this.nodeList.push(node);
  }

  public nodeCount(): number {
    return this.nodeList.length;
  }

  public getStatus(): Promise<any> {
    return Promise.all(Lodash.map(this.nodeList, (node: Node) => {
      return node.getStatus();
    }));
  }

  public update(pkg: any, index?: number): Promise<any> {
    if (index != undefined) {
      return this.nodeList[index].update(pkg);
    }
    return Promise.all(Lodash.map(this.nodeList, (node: Node) => {
      return node.update(pkg);
    }));
  }

  public addProgram(programName: string, command: string, filename: string, program: any, index?: number): any  {
    const path = this.getAbsolutePath(filename);
    if (index != undefined) {
      return this.nodeList[index].addProgram(programName, command, path, program);
    }
    return Promise.all(Lodash.map(this.nodeList, (node: Node) => {
      return node.addProgram(programName, command, path, program);
    }));
  }

  public runProgram(programName: string, args: string[], index?: number): Promise<any> {
    if (index != undefined) {
      return this.nodeList[index].runProgram(programName, args);
    }
    return Promise.all(Lodash.map(this.nodeList, (node: Node) => {
      return node.runProgram(programName, args);
    }));
  }

  public addCommand(commandName: string, command: string, index?: number): any {
    if (index != undefined) {
      return this.nodeList[index].addCommand(commandName, command);
    }
    return Promise.all(Lodash.map(this.nodeList, (node: Node) => {
      return node.addCommand(commandName, command);
    }));
  }

  public runCommand(commandName: string, args: string[], index?: number): Promise<any> {
    if (index != undefined) {
      return this.nodeList[index].runCommand(commandName, args);
    }
    return Promise.all(Lodash.map(this.nodeList, (node: Node) => {
      return node.runCommand(commandName, args);
    }));
  }

  public getFileSystem(): FileSystem {
    return this.fileSystem;
  }

  private getAbsolutePath(path: string): string {
    return Path.join(this.fileSystem.getRoot(), path);
  }
}
import * as Shell from "shelljs";

import {
  NodeClient,
  NodeShell
} from "../modules";

export class Node {
  private thread: number;
  private address: string;
  private status: string;
  private shell: NodeShell;
  private next: NodeClient;
  private stack: Promise<any>;

  constructor(thread: number, address: string, shell: NodeShell, next: NodeClient) {
    this.thread = thread;
    this.address = address;
    this.status = "OK";
    this.shell = shell;
    this.next = next;
    this.stack = Promise.resolve();
  }

  public getThread(): number {
    return this.thread;
  }

  public getAddress(): string {
    return this.address;
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
}
import {
  NodeClient,
  NodeShell
} from "../modules";

export class Node {
  private id: number;
  private status: string;
  private shell: NodeShell;
  private next: NodeClient;
  private stack: Promise<any>;

  constructor(id: number, shell: NodeShell, next: NodeClient) {
    this.id = id;
    this.status = "OK";
    this.shell = shell;
    this.next = next;
    this.stack = Promise.resolve();
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
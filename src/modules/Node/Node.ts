import * as Shell from "shelljs";
import * as Lodash from "lodash";

import { NodeClient, ClientCommunicator } from "../modules";

export class Node {
  private address: string;
  private status: string;
  private next: NodeClient;
  private stack: Promise<any>;

  constructor(address: string, next?: NodeClient) {
    this.address = address;
    this.status = "OK";
    this.next = next;
    this.stack = Promise.resolve();
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

  public getStack(): Promise<any> {
    return this.stack;
  }

  public addToStack(promise: Promise<any>) {
    this.stack = this.stack.then((status) => {
      return promise;
    });
  }

  public setNext(next: NodeClient) {
    this.next = next;
  }

  public execute(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      Shell.exec(command, (code: number, out: string, err: any) => {
        resolve(out);
      });
    });
  }
}
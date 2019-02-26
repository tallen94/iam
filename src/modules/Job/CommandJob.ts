import { Job } from "../modules";
import * as UUID from "uuid";

export class CommandJob implements Job {

  private id: string;
  private status: string;
  private command: any;
  private result;

  constructor(command: any) {
    this.id = UUID.v4();
    this.command = command;
    this.status = "NEW";
  }

  public getId() {
    return this.id;
  }

  public setResult(result: any): void {
    this.result = result;
  }

  public getResult(): any {
    return this.result;
  }

  public getStatus(): string {
    return this.status;
  }

  public getCommand(): any {
    return this.command;
  }

  public start(): void {
    this.status = "RUNNING";
  }

  public complete(): void {
    this.status = "COMPLETED";
  }

  public error(): void {
    this.status = "ERROR";
  }
}
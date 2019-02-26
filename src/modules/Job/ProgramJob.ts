import { Job } from "../modules";
import * as UUID from "uuid";

export class ProgramJob implements Job {

  private id: string;
  private status: string;
  private program: any;
  private result: any;

  constructor(program: any) {
    this.id = UUID.v4();
    this.program = program;
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

  public getProgram(): any {
    return this.program;
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
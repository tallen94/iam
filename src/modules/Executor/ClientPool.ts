import * as Lodash from "lodash";
import { Client } from "../modules";
import { RemoteProcess } from "../Process/RemoteProcess";
import { Process } from "../Process/Process";

export class ClientPool {

  private clients: Client[];

  constructor() {
    this.clients = [];
  }

  public spawn(name: string, threads: number): Process[] {
    return Lodash.map(this.getNClients(threads), (thread: Client) => {
      const process: Process = new RemoteProcess(thread.getHost(), thread.getPort(), name);
      return process;
    });
  }

  public runExecutable(type: string, name: string, data: any, threads: number) {
    return this.each(this.getNClients(threads), (thread: Client) => { return thread.runExecutable(type, name, data); });
  }

  public addClient(client: Client): void {
    this.clients.push(client);
  }

  public setClients(clients: Client[]) {
    this.clients = clients;
  }

  public numClients(): number {
    return this.clients.length;
  }

  public getStatus(): Promise<any> {
    return this.each(this.clients, (thread: Client) => { return thread.getStatus(); });
  }

  public update(pkg: any): Promise<any> {
    return this.each(this.clients, (thread: Client) => { return thread.update(pkg); });
  }

  public addProgram(name: string, exe: string, filename: string, run: string, program: any, dataType: string, dataModel: any): any  {
    return this.each(this.clients, (thread: Client) => {
      return thread.addProgram(name, exe, filename, run, program, dataType, dataModel);
    });
  }

  public runProgram(name: string, data: any, threads: number): Promise<any> {
    return this.each(this.getNClients(threads), (thread: Client) => { return thread.runProgram(name, data); } );
  }

  public addCommand(name: string, command: string, dataType: string, dataModel: any): any {
    return this.each(this.clients, (thread: Client) => { return thread.addCommand(name, command, dataType, dataModel); });
  }

  public runCommand(name: string, data: any, threads: number): Promise<any> {
    return this.each(this.getNClients(threads), (thread: Client) => { return thread.runCommand(name, data); } );
  }

  public addQuery(name: string, query: string, dataType: string, dataModel: any, userId: number): any {
    return this.each(this.clients, (thread: Client) => { return thread.addQuery(name, query, dataType, dataModel, userId); });
  }

  public runQuery(name: string, data: any, threads: number): Promise<any> {
    return this.each(this.getNClients(threads), (thread: Client) => { return thread.runQuery(name, data); } );
  }

  public addStepList(name: string, data: string, dataType: string, dataModel: any, userId: number) {
    return this.each(this.clients, (thread: Client) => { return thread.addStepList(name, data, dataType, dataModel, userId); });
  }

  public runStepList(name: string, data: any, threads: number): Promise<any> {
    return this.each(this.getNClients(threads), (thread: Client) => { return thread.runStepList(name, data); });
  }

  public getRandomClient(): Client {
    const index = Math.floor(Math.random() * this.clients.length);
    return this.clients[index];
  }

  public each(list: Client[], fn: (thread: Client) => Promise<any>) {
    return Promise.all(Lodash.map(list, fn));
  }

  public getNClients(n: number): Client[] {
    const clients = [];
    for (let i = 0; i < n; i++) {
      clients.push(this.getRandomClient());
    }
    return clients;
  }
}
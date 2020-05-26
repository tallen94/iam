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

  public runExecutable(username: string, exe: string, name: string, data: any, threads: number) {
    // return this.each(this.getNClients(threads), (thread: Client) => { return thread.runExecutable(username, exe, name, data, ""); });
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

  public getRandomClient(): Client {
    const index = Math.floor(Math.random() * this.clients.length);
    return this.clients[index];
  }

  public each(list: Client[], fn: (thread: Client) => Promise<any>) {
    return Promise.all(Lodash.map(list, fn));
  }

  public eachClient(fn: (client: Client) => Promise<any>) {
    return this.each(this.clients, fn);
  }

  public getNClients(n: number): Client[] {
    const clients = [];
    for (let i = 0; i < n; i++) {
      clients.push(this.getRandomClient());
    }
    return clients;
  }
}
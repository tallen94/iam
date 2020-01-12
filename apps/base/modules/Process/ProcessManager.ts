import { Process } from "./Process";
import { LocalProcess } from "./LocalProcess";
import { RemoteProcess } from "./RemoteProcess";

export class ProcessManager {

  private processList: { [key: string]: Process };

  constructor() {
    this.processList = {};
  }

  public spawn(name: string, command: string, args: string[], type: string) {
    switch (type) {
      case "LOCAL":
      case "REMOTE":
      case "DATABASE":
    }
    this.processList[name] = type == "LOCAL" ?
    new LocalProcess(command, args) :
    new RemoteProcess("localhost", 5001, name);
    this.processList[name].spawn();
    return this.processList[name];
  }

  public stdin(name: string) {
    return this.processList[name].stdin();
  }

  public stdout(name: string) {
    return this.processList[name].stdout();
  }
}
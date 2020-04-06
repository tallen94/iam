import { Executable } from "./Executable";
import { EnvironmentManager } from "../Environment/EnvironmentManager";
import { ExecutableFactory } from "./ExecutableFactory";
import { Function } from "./Function";

export class Environment implements Executable {

  constructor(
    private username: string,
    private name: string,
    private executableFactory: ExecutableFactory
  ) {

  }

  public getUsername(): string {
    return this.username
  }

  public getName(): string {
    return this.name
  }

  public getVisibility(): string {
    return "auth";
  }

  public run(data: any): Promise<any> {
    return this.executableFactory.function({
      username: this.username, 
      name: "build-environment"
    }).then((fn: Function) => {
      return fn.run({tag: data.tag, image: this.name, username: this.username})
    }).then((result) => {
      return result;
    })
  }
}
import { Executable } from "./Executable";
import { DatabaseCommunicator } from "../Communicator/DatabaseCommunicator";

export class Query implements Executable {

  constructor(
    private username: string,
    private name: string,
    private visibility: string,
    private file: string,
    private database: DatabaseCommunicator
  ) {

  }

  public getUsername() {
    return this.username
  }

  public getName(): string {
    return this.name
  }

  public getVisibility(): string {
    return this.visibility
  }

  public run(data: any): Promise<any> {
    return this.database.execute(this.file, data);
  }
}
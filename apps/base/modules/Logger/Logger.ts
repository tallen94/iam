import { Executor } from "../Executor/Executor";

export class Logger {

  private executor: Executor;

  constructor(executor: Executor) {
    this.executor = executor;
  }

  public logUserAction(userId: number, action: string, data: any) {
    const queryStr = "INSERT INTO user_action(userId, action, data, time) " +
      "VALUES ({userId}, {action}, {data}, NOW())";
    this.executor.getDatabase()
    .runQueryString(queryStr, {userId: userId, action: action, data: JSON.stringify(data)});
  }
}
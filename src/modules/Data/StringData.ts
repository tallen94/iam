import { Data } from "./Data";

export class StringData implements Data {

  private value: string;

  constructor(value: string) {
    this.value = value;
  }

  public getValue() {
    return this.value;
  }

  public getString() {
    return this.value;
  }
}
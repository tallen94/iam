import { Data } from "./Data";

export class JsonData implements Data {

  private value: any;

  constructor(value: any) {
    this.value = value;
  }

  public getValue() {
    return this.value;
  }

  public getString() {
    return JSON.stringify(this.value);
  }
}
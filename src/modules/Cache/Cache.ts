import * as crypto from "crypto";

export class Cache {

  private cache: any;

  constructor() {
    this.cache = {};
  }

  public setValue(key: string, value: any) {
    const md5_key = crypto.createHash("md5").update(key).digest("hex");
    this.cache[md5_key] = value;
  }

  public getValue(key: string) {
    const md5_key = crypto.createHash("md5").update(key).digest("hex");
    return this.cache[md5_key];
  }

  public clearCache() {
    this.cache = {};
  }
}
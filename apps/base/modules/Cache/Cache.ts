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

  public getValue(key: string, hit: (value) => void, miss: () => void, shouldCache: boolean) {
    const md5_key = crypto.createHash("md5").update(key).digest("hex");
    if (!shouldCache || this.cache[md5_key] == undefined) {
      miss();
    } else {
      hit(this.cache[md5_key]);
    }
  }

  public clearCache() {
    this.cache = {};
  }
}
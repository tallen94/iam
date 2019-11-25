import { Duplex } from "stream";

export class CollectDuplex extends Duplex {

  private _data = [];

  public _write(chunk, encoding, cb) {
    this._data = this._data.concat(chunk);
    cb();
  }

  public _read() {
    this.push(this._data);
    this.push(null);
  }
}
import { Duplex } from "stream";

export class File extends Duplex {

  private _data = "";

  public _write(chunk, encoding, cb) {
    this._data = chunk;
    cb();
  }

  public _read() {
    this.push(this._data);
    this.push(null);
  }
}
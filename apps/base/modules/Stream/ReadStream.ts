import { Stream } from "stream";

export class ReadStream extends Stream.Readable {

  private _start;
  private _end;
  private _curr;

  constructor(opts) {
    super(opts);
    this._start = 0;
    this._end = 100;
    this._curr = this._start;
  }

  public _read(size?: number) {
    const num = this._curr;
    const buf = new Buffer(num.toString(), "utf-8");
    this.push(buf);
    this._curr++;

    if (num === this._end) {
        this.push(null);
    }
  }
}
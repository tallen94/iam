import { Stream } from "stream";

export class WriteStream extends Stream.Writable {

  constructor() {
    super();
  }

  public _write(chunk, encoding, cb) {
    this.emit("data", chunk);
    cb();
  }
}
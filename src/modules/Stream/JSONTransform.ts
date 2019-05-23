import { Stream } from "stream";

export class JSONTransform extends Stream.Transform {

  constructor(opts) {
    super(opts);
  }

  public _transform(chunk, encoding, cb) {
    this.push(JSON.stringify(chunk));
    cb();
  }
}
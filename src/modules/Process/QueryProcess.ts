import { Process } from "./Process";
import Lodash from "lodash";
import { Readable, Writable } from "stream";
import { Connection } from "mysql";
import { JSONTransform } from "../Stream/JSONTransform";
import { WriteStream } from "../Stream/WriteStream";
import { GenericDuplex } from "../Stream/GenericDuplex";


export class QueryProcess implements Process {

  private query: string;
  private db: Connection;
  private write: Writable;
  private read: Readable;
  private pipe: any;

  constructor(query: string, db: Connection) {
    this.write = new WriteStream();
    this.query = query;
    this.db = db;
  }

  public spawn(chunk?: any) {
    const data = JSON.parse(chunk.toString());
    const replaced = this.replace(this.query, data);
    const transform = new JSONTransform({ objectMode: true });
    this.pipe = new GenericDuplex({objectMode: true});
    this.db.query(replaced).stream().pipe(transform);
    return transform;
  }

  public stdin() {
    return this.write;
  }

  public stdout() {
    return this.read;
  }

  private replace(s: string, data: any): string {
    Lodash.each(data, (value, key) => {
      s = s.replace("{" + key + "}", value);
    });
    return s;
  }
}


import { createConnection, Connection, MysqlError } from "mysql";
import Lodash from "lodash";

export class DatabaseCommunicator {
  private db: Connection;
  private errorLog: any;
  private outputLog: any;

  constructor(user: string, password: string, host: string, database: string) {
    // this.errorLog = fs.createWriteStream("../../logs/database/error.txt");
    // this.outputLog = fs.createWriteStream("../../logs/database/out.txt");
    this.connect(user, password, host, database);
  }

  private connect(user: string, password: string, host: string, database: string): Promise<MysqlError> {
    this.db = createConnection({
      host: host,
      user: user,
      password: password,
      database: database,
      multipleStatements: true
    });

    return new Promise((resolve, reject) => {
      this.db.connect((err: MysqlError) => {
        resolve(err);
      });
    });
  }

  public execute(query: string) {
    return new Promise((resolve, reject) => {
      this.db.query(query, (err: MysqlError, data: any) => {
        if (err) {
          // this.error(err);
          reject(err);
        } else {
          // this.output(proc + " | " + params);
          resolve(data);
        }
      });
    });
  }

  public procedure(proc: string, params?: any): Promise<MysqlError> {
    // this.output("Procedure Call - " + proc);
    // this.output("Parameters: " + params);
    return new Promise((resolve, reject) => {
      const put = params ? this.sortValuesByKey(params) : [];
      this.db.query(proc, put, (err: MysqlError, data: any) => {
        if (err) {
          // this.error(err);
          reject(err);
        } else {
          // this.output(proc + " | " + params);
          resolve(data);
        }
      });
    });
  }

  private sortValuesByKey(obj: any) {
    const sortedKeys = Lodash.sortBy(Object.keys(obj), (key) => { return key; });
    return Lodash.map(sortedKeys, (key) => { return obj[key]; });
  }

  private error(str: any) {
    this.errorLog.write(new Date().toISOString() + "\n");
    this.errorLog.write(str + "\n");
    this.errorLog.write("\n");
  }

  private output(str: any) {
    this.outputLog.write(new Date().toISOString() + "\n");
    this.outputLog.write(str + "\n");
    this.outputLog.write("\n");
  }
}
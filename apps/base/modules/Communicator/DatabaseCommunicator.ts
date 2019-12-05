import { MysqlError, createPool, Pool } from "mysql";
import Lodash from "lodash";

export class DatabaseCommunicator {
  private db: Pool;
  private errorLog: any;
  private outputLog: any;

  constructor(user: string, password: string, host: string, port: number, database: string) {
    // this.errorLog = fs.createWriteStream("../../logs/database/error.txt");
    // this.outputLog = fs.createWriteStream("../../logs/database/out.txt");
    this.connect(user, password, host, port, database);
  }

  public getConnection() {
    return this.db;
  }

  private connect(user: string, password: string, host: string, port: number, database: string) {
    this.db = createPool({
      host: host,
      user: user,
      port: port,
      password: password,
      database: database,
      multipleStatements: true
    });
  }

  public execute(query: string, params: any) {
    const preparedQuery = this.prepareQuery(query, params);
    return new Promise((resolve, reject) => {
      this.db.query(preparedQuery.query, preparedQuery.data, (err: MysqlError, data: any) => {
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
      }).stream();
    });
  }

  public escape(str: string) {
    return this.db.escape(str);
  }

  private sortValuesByKey(obj: any) {
    const sortedKeys = Lodash.sortBy(Object.keys(obj), (key) => { return key; });
    return Lodash.map(sortedKeys, (key) => { return obj[key]; });
  }

  public replace(s: string, data: any): string {
    Lodash.each(data, (value, key) => {
      s = s.replace(new RegExp("{" + key + "}", "g"), "?");
    });
    return s;
  }

  public prepareQuery(query: string, data: any) {
    const dataArray = [];
    for (let i = 0; i < query.length; i++) {
      let char = query.substring(i, i + 1);
      if (char === "{") {
        i++;
        char = query.substring(i, i + 1);
        let key = "";
        while (char !== "}" && i < query.length) {
          key = key + char;
          i++;
          char = query.substring(i, i + 1);
        }
        if (char !== "}") {
          const err = "Unable to parse query. Error near '" + key + "' : " + i;
          console.log(err);
          throw err;
        }

        if (data[key] == undefined) {
          dataArray.push(undefined);
        } else {
          dataArray.push(data[key]);
        }
      }
    }
    return {
      data: dataArray,
      query: this.replace(query, data)
    };
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

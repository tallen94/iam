import { Process } from "./Process";
import Request from "request";
import { ApiPaths } from "../Api/ApiPaths";
import Lodash from "lodash";

export class RemoteProcess implements Process {

  private host: string;
  private port: number;
  private name: string;
  private duplex: Request.Request;

  constructor(host: string, port: number, name: string) {
    this.host = host;
    this.port = port;
    this.name = name;
  }

  public spawn() {
    const options = {
      method: "post",
      url: this.getAbsoluteUrl(ApiPaths.SPAWN_PROCESS, {type: "LOCAL", name: this.name})
    };
    this.duplex = Request.post(options);
  }

  public stdin() {
    return this.duplex;
  }

  public stdout() {
    return this.duplex;
  }

  private getAbsoluteUrl(url: string, params?: any) {
    const path = params == undefined ? url : this.replace(url, params);
    return "http://" + this.host + ":" + this.port + path;
  }

  private replace(s: string, data: any): string {
    Lodash.each(data, (value, key) => {
      s = s.replace(":" + key, value);
    });
    return s;
  }
}
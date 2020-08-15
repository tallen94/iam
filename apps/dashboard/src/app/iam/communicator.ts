import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Lodash from 'lodash';

@Injectable()
export class ClientCommunicator {
  constructor(
    private http: HttpClient,
    private protocol: string,
    private host: string,
    private port: number
  ) { }

  public getHost() {
    return this.host;
  }

  public get(url: string, params?: any, data?: any, headers?: any) {
    const absUrl = this.getAbsoluteUrl(url, params);
    console.log(absUrl)
    return this.http.get(absUrl, { params: data, headers: headers });
  }

  public post(url: string, data?: any, params?: any, headers?: any, responseType?: string) {
    const absUrl = this.getAbsoluteUrl(url, params);
    console.log(absUrl)
    const opts = { headers: headers };
    if (responseType) 
      opts["responseType"] = responseType;
    return this.http.post(absUrl, data, opts);
  }

  public delete(url: string, data?: any, params?: any, headers?: any) {
    const absUrl = this.getAbsoluteUrl(url, params)
    const opts = { headers: headers, params: data }
    return this.http.delete(absUrl, opts)
  }

  private replace(s: string, data: any): string {
    Lodash.each(data, (value, key) => {
      s = s.replace(":" + key, value);
    });
    return s;
  }

  private getAbsoluteUrl(url: string, params?: any) {
    const path = params === undefined ? url : this.replace(url, params);
    return this.protocol + "//" + this.host + ":" + this.port + path;
  }
}
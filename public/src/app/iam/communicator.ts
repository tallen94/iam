import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as Lodash from 'lodash';

@Injectable()
export class ClientCommunicator {
  private host: string;
  private port: number;
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.host = "iam-local"; //window.location.hostname;
    this.port = 30001;
    this.http = http;
  }

  public getHost() {
    return this.host;
  }

  public setHostPort(host: string, port: number) {
    this.host = host;
    this.port = port;
  }

  public get(url: string, params?: any, data?: any, headers?: any) {
    const absUrl = this.getAbsoluteUrl(url, params);
    return this.http.get(absUrl, { params: data, headers: headers });
  }

  public post(url: string, data?: any, params?: any, headers?: any, responseType?: string) {
    const absUrl = this.getAbsoluteUrl(url, params);
    const opts = { headers: headers };
    if (responseType) 
      opts["responseType"] = responseType;
    return this.http.post(absUrl, data, opts);
  }

  private replace(s: string, data: any): string {
    Lodash.each(data, (value, key) => {
      s = s.replace(":" + key, value);
    });
    return s;
  }

  private getAbsoluteUrl(url: string, params?: any) {
    const path = params === undefined ? url : this.replace(url, params);
    return "http://" + this.host + ":" + this.port + path;
  }
}
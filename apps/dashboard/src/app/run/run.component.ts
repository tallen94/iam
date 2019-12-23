import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Iam } from "../iam/iam";

@Component({
  selector: 'run',
  templateUrl: './run.component.html',
  styleUrls: ['./run.component.css']
})
export class RunComponent implements OnInit {
  @Output() emitRunning: EventEmitter<any> = new EventEmitter();

  requestData: string = "";
  responseData: string = "";
  _running: any = {};
  public options = {
  }

  constructor(
    private iam: Iam
  ) { }

  ngOnInit() { }

  get running() {
    return this._running;
  }

  @Input()
  set running(data: any) {
    this.requestData = data.input;
    this.responseData = data.output;
    this._running = data;
  }

  close() {
    this.emitRunning.emit(undefined);
  }

  run() {
    if (this.running == undefined) {
      return;
    }

    this.responseData = "";
    if (this.requestData == "") {
      this.requestData = undefined;
    } else {
      try {
        this.requestData = JSON.parse(this.requestData);
      } catch { }
    } 

    this.iam.runExecutable(this._running.username, this._running.exe, this._running.name, this.requestData)
    .subscribe((response: any) => {
      const json =  this.isJsonString(response.result);
      if (json) {
        this.responseData = JSON.stringify(json, null, 2);
      } else if (response.result instanceof Array || response.result instanceof Object) {
        this.responseData = JSON.stringify(response.result, null, 2);
      } else {
        this.responseData = "" + response.result;
      }
    });
    this.requestData = JSON.stringify(this.requestData, null, 2);
  }

  isJsonString(str: any) {
    try {
      return JSON.parse(str)
    } catch {
      return false;
    }
  }
}

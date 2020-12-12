import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Iam } from "../iam/iam";
import { interval, Subscription } from 'rxjs';

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
  time: string;
  diff: any;
  future: Date;
  start: Date;
  timer: Subscription;
  public options = {
  }

  constructor(
    private iam: Iam
  ) { 
    this.time = "0:0:0"
  }

  ngOnInit() { 
  }

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

    this.time = "0:0:0"
    this.start = new Date();
    this.timer = interval(10).subscribe((x) => {
      this.future = new Date(this.start.toString().replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
      this.diff = Math.floor((new Date().getTime() - this.start.getTime()));
      this.time = this.dhms(this.diff);
    });

    this.iam.runExecutable(this._running.username, this._running.cluster, this._running.environment, this._running.exe, this._running.name, this.requestData)
    .subscribe((response: any) => {
      this.timer.unsubscribe()
      const json =  this.isJsonString(response.result);
      if (json) {
        this.responseData = JSON.stringify(json, null, 2);
      } else if (response.result instanceof Array || response.result instanceof Object) {
        this.responseData = JSON.stringify(response.result, null, 2);
      } else {
        this.responseData = "" + response.result;
      }
    }, (error: any) => {
      this.timer.unsubscribe()
      this.responseData = JSON.stringify(error, null, 2);
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

  dhms(difference) {
    let mins, secs, millis;
    mins = Math.floor(((difference % (60 * 60 * 1000 * 24)) % (60 * 60 * 1000)) / (60 * 1000) * 1);
    secs = Math.floor((((difference % (60 * 60 * 1000 * 24)) % (60 * 60 * 1000)) % (60 * 1000)) / 1000 * 1);
    millis = Math.floor((((difference % (60 * 60 * 1000 * 24)) % (60 * 60 * 1000)) % (60 * 1000) % 1000) * 1);

    return [
      mins,
      secs,
      millis
    ].join(':');
  }
}

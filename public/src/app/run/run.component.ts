import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Iam } from "../iam/iam";
import { Location } from '@angular/common';

@Component({
  selector: 'run',
  templateUrl: './run.component.html',
  styleUrls: ['./run.component.css']
})
export class RunComponent implements OnInit {

  requestData: string = "";
  responseData: string = "";
  _selected: any = {};

  constructor(
    private iam: Iam
  ) { }

  ngOnInit() { }

  get selected() {
    return this._selected;
  }

  @Input()
  set selected(data: any) {
    this.requestData = data.input;
    this._selected = data;
  }

  run() {
    if (this.selected == undefined) {
      return;
    }

    this.responseData = "";
    let data;
    if (this.requestData == "") {
      data = undefined;
    } else {
      try {
        data = JSON.parse(this.requestData);
        this.requestData = JSON.stringify(data, null, 2);
      } catch {
        data = this.requestData;
      }
    } 

    this.iam.runExecutable(this._selected.username, this._selected.exe, this._selected.name, data)
    .subscribe((response: any) => {
      try {
        this.responseData = JSON.stringify(response.result, null, 2);
      } catch {
        this.responseData = response.result;
      }
    });
  }
}

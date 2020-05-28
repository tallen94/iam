import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Iam } from '../iam/iam';
import * as Lodash from 'lodash';

@Component({
  selector: 'environment',
  templateUrl: './environment.component.html',
  styleUrls: ['./environment.component.css']
})
export class EnvironmentComponent implements OnInit {

  _data: any;
  @Output() newResourceEvent: EventEmitter<any> = new EventEmitter();
  @Output() selectResourceEvent: EventEmitter<any> = new EventEmitter();
  public newResource: string;
  public functions: any[];
  public queries: any[];
  public graphs: any[];
  public editing: boolean = false;
  public buildingImage: boolean = false;
  private prevData: any = {};
  private options = {
    maxLines: 32,
    wrap: true,
    autoScrollEditorIntoView: true,
    fontSize: "18px"
  }

  constructor(private iam: Iam) { }

  @Input() 
  set data(value: any) {
    this._data = value;
    this.prevData = JSON.parse(JSON.stringify(this.data))
    this.iam.getExecutables(this.iam.getUser().username, "function").subscribe((result: any[]) => {
      this.functions = Lodash.filter(result, (item) => item.cluster === this.data.cluster && item.environment === this.data.name);
    })
    this.iam.getExecutables(this.iam.getUser().username, "query").subscribe((result: any[]) => {
      this.queries = Lodash.filter(result, (item) => item.cluster === this.data.cluster && item.environment === this.data.name);
    })
    this.iam.getExecutables(this.iam.getUser().username, "graph").subscribe((result: any[]) => {
      this.graphs = Lodash.filter(result, (item) => item.cluster === this.data.cluster && item.environment === this.data.name);
    })
  }

  get data() {
    return this._data;
  }


  ngOnInit() {
  }

  save() {
    this.iam.addEnvironment(this.data)
    .subscribe((result) => {
      this.editing = false;
    })
  }

  triggerEdit() {
    this.editing = true;
    this.prevData = JSON.parse(JSON.stringify(this.data));
  }

  cancelEdit() {
    this.editing = false;
    this.data = JSON.parse(JSON.stringify(this.prevData));
  }

  isEmpty(str: string) {
    return str === undefined || str === ''
  }

  getCodeMarkdown(command, text) {
    return "```" + command + "\n" + text + "\n```";
  }

  inputSize(key: string) {
    if (key && this.data[key]) {
      if ((this.data[key].length) < 8) {
        return 8
      }

      return this.data[key].length
    }
    return 8;
  }

  receiveNewResourceModalDone(value: any) {
    this.newResourceEvent.emit(value)
    this.newResource = undefined;
  }

  receiveNewResourceModalCancel() {
    this.newResource = undefined;
  }

  addResource(exe: string) {
    this.newResource = exe;
  }

  selectResource(exe: string, value: any) {
    value.exe = exe;
    this.selectResourceEvent.emit(value)
  }

  startEnvironment() {
    this.iam.startEnvironment(this.data.username, this.data.name, this.data.cluster)
    .subscribe((result: any) => {
      if (result.state) {
        this.data.state = result.state;
      }
    })
  }

  stopEnvironment() {
    this.iam.stopEnvironment(this.data.username, this.data.name, this.data.cluster)
    .subscribe((result: any) => {
      if (result.state) {
        this.data.state = result.state;
      } 
    })
  }
}

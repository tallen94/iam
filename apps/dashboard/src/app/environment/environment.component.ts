import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Iam } from '../iam/iam';

@Component({
  selector: 'environment',
  templateUrl: './environment.component.html',
  styleUrls: ['./environment.component.css']
})
export class EnvironmentComponent implements OnInit {

  @Input() data: any;
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

  ngOnInit() {
    console.log(this.data)
    this.prevData = JSON.parse(JSON.stringify(this.data))
    this.iam.getExecutables(this.iam.getUser().username, "function").subscribe((data: any[]) => {
      this.functions = data;
    })
    this.iam.getExecutables(this.iam.getUser().username, "query").subscribe((data: any[]) => {
      this.queries = data;
    })
    this.iam.getExecutables(this.iam.getUser().username, "graph").subscribe((data: any[]) => {
      this.graphs = data;
    })
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

  buildImage() {
    this.buildingImage = true;
    this.iam.buildImage(this.data.username, this.data.name, this.data.cluster)
    .subscribe((result: any) => {
      this.buildingImage = false;
      if (result.environment) {
        this.data = result.environment;
      }
    })
  }
}

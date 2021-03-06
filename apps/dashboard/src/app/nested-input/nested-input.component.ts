import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Iam } from '../iam/iam';
import * as Lodash from "lodash";

@Component({
  selector: 'nested-input',
  templateUrl: './nested-input.component.html',
  styleUrls: ['./nested-input.component.css']
})
export class NestedInputComponent implements OnInit {
  @Output() run: EventEmitter<any> = new EventEmitter();
  @Output() emitEditing: EventEmitter<any> = new EventEmitter();
  @Output() emitHidden: EventEmitter<any> = new EventEmitter();
  @Output() emitRunning: EventEmitter<any> = new EventEmitter();
  @Output() emitUpdateData: EventEmitter<any> = new EventEmitter();

  private _data: any;
  @Input() border: boolean;
  @Input() hidden: any[] = [];
  @Input() editing: any[] = [];
  @Input() running: any;
  @Input() showForeach: boolean;
  private prevData: any;
  private prevExe: string = "";
  private options = {
    maxLines: 32,
    wrap: true,
    autoScrollEditorIntoView: true,
    fontSize: "18px"
  }

  constructor(private iam: Iam) { }

  @Input()
  set data(value: any) {
    this.iam.getExecutable(value.username, value.cluster, value.environment, value.exe, value.name)
    .subscribe((result) => {
      if (result == undefined) {
        this._data = value;
      } else {
        this._data = result;
      }
      this.prevData = JSON.parse(JSON.stringify(this._data));
      if (this.data.id == undefined) {
        this.data.id = (this.data.exe == "graph" ? "0" : "1")
      }
    })
  }

  get data() {
    return this._data;
  }

  ngOnInit() { }

  addStep() {
    const newData = []
    Lodash.each(this.data, (step) => {
      newData.push(step);
    })
    newData.push({name: "", exe: ""});
    this.data = newData;
  }

  isHidden() {
    return this.data && (this.data.id !== undefined && Lodash.indexOf(this.hidden, this.data.id) != -1);
  }

  isEditing() {
    return this.data && this.data.id !== undefined && Lodash.indexOf(this.editing, this.data.id) != -1;
  }

  triggerShow() {
    if (this.isHidden()) {
      this.hidden = Lodash.filter(this.hidden, (item) => item !== this.data.id)
    } else {
      this.hidden.push(this.data.id)
    }
    this.hidden = [...this.hidden];
    this.emitHidden.emit(this.hidden)
  }

  triggerEdit() {
    if (this.isHidden()) {
      this.triggerShow();
    }
    this.prevData = JSON.parse(JSON.stringify(this.data));
    this.data.id = "" + this.data.id;
    this.editing.push(this.data.id)
    this.editing = [...this.editing];
    this.emitEditing.emit(this.editing);
  }

  cancelEdit() {
    this.editing = Lodash.filter(this.editing, (item) => item !== this.data.id)
    this.data = JSON.parse(JSON.stringify(this.prevData));
    this.data.id = "" + this.data.id;
    this.editing = [...this.editing];
    this.emitEditing.emit(this.editing); 
  }

  triggerRunning() {
    this.emitRunning.emit(this.data);
  }
  
  receiveEmitEditing(data: any) {
    this.editing = data;
    this.emitEditing.emit(data)
  }

  receiveEmitHidden(data: any) {
    this.hidden = data;
    this.emitHidden.emit(data)
  }

  receiveEmitRunning(data: any) {
    this.emitRunning.emit(data);
  }

  receiveUpdateData(data: any) {
    if (this.data.exe != "graph") {
      data.id = this.data.id;
      this.data = data;
    } else {
      this.data.graph.nodes = Lodash.map(this.data.graph.nodes, (node) => {
        if (node.id == data.id) {
          return data;
        }
        return node;
      })
    }
    this.emitUpdateData.emit(this.data)
  }

  getCodeMarkdown(command, text) {
    return "```" + command + "\n" + text + "\n```";
  }

  public save() {
    if (this.data.name !== "" && this.data.exe !== "") {
      this.iam.addExecutable(this.data)
      .subscribe((response) => {
        this.prevData = this.data;
        this.cancelEdit();
        this.emitUpdateData.emit(this.data)
      })
    }
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

  isEmpty(str: string) {
    return str === undefined || str === '';
  }

  applyPool() {
    // this.iam.runExecutable("admin", "graph", "update-env-pool", [{svc: this.data.environment}, {username: this.data.username, name: this.data.name}])
    // .subscribe((result) => {
    //   console.log(result)
    // })
  }
} 

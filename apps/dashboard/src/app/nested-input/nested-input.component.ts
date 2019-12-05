import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Iam } from '../iam/iam';
import * as Lodash from "lodash";
import { InitData } from '../iam/init-data';

@Component({
  selector: 'nested-input',
  templateUrl: './nested-input.component.html',
  styleUrls: ['./nested-input.component.css']
})
export class NestedInputComponent implements OnInit {
  @Output() run: EventEmitter<any> = new EventEmitter();
  @Output() emitEditing: EventEmitter<any> = new EventEmitter();
  @Output() emitRunning: EventEmitter<any> = new EventEmitter();

  @Input() data: any;
  @Input() border: boolean;
  @Input() hidden: any[] = [];
  @Input() editing: any[] = [];
  @Input() running: any;
  private prevData: any;
  private prevExe: string = "";
  private options = {
    maxLines: 32,
    wrap: true,
    autoScrollEditorIntoView: true
  }

  constructor(private iam: Iam) { }

  ngOnInit() {
    if (this.data.exe == "graph") {
      this.data.id = "0";
    } else if (this.data.id == undefined) {
      this.data.id = "1";
    }
  }

  addStep() {
    const newData = []
    Lodash.each(this.data, (step) => {
      newData.push(step);
    })
    newData.push({name: "", exe: ""});
    this.data = newData;
  }

  match(item: any) {
    return item.name == this.data.name
    && item.exe === this.data.exe
    && item.username === this.data.username;
  }

  isHidden() {
    return !Lodash.some(this.hidden, this.data);
  }

  isEditing() {
    return this.data.id !== undefined && Lodash.indexOf(this.editing, this.data.id) != -1;
  }

  triggerShow() {
    if (!this.isHidden()) {
      this.hidden = Lodash.filter(this.hidden, (item) => !this.match(item))
    } else {
      this.hidden.push(this.data)
    }
    this.hidden = [...this.hidden];
  }

  triggerEdit() {
    if (!this.isEditing()) {
      this.prevData = JSON.parse(JSON.stringify(this.data));
      this.data.id = "" + this.data.id;
      this.editing.push(this.data.id)
      this.editing = [...this.editing];
      this.emitEditing.emit(this.editing);
    }
  }

  cancelEdit() {
    if (this.isEditing()) {
      this.editing = Lodash.filter(this.editing, (item) => item !== this.data.id)
      this.data = JSON.parse(JSON.stringify(this.prevData));
      this.data.id = "" + this.data.id;
      this.editing = [...this.editing];
      this.emitEditing.emit(this.editing);
    } 
  }

  triggerRunning() {
    this.emitRunning.emit(this.data);
  }
  
  receiveEmitEditing(data: any) {
    this.editing = data;
    this.emitEditing.emit(data)
  }

  receiveEmitRunning(data: any) {
    this.emitRunning.emit(data);
  }

  receiveUpdateData(data: any) {
    this.data = data;
  }

  getCodeMarkdown(command, text) {
    return "```" + command + "\n" + text + "\n```";
  }

  public save() {
    if (this.data.name !== "" && this.data.exe !== "") {
      this.iam.addExecutable(this.data)
      .subscribe((response) => {
        this.triggerEdit();
      })
    }
  }

  inputSize(key: string) {
    if (key && this.data[key]) {
      if ((this.data[key].length) < 5) {
        return 5
      }

      return this.data[key].length
    }
    return 5;
  }

  isEmpty(str: string) {
    return str === undefined || str === '';
  }
} 

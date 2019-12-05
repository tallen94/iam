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
    if (this.isEditing()) {
      this.editing = Lodash.filter(this.editing, (item) => item !== this.data.id)
    } else {
      this.editing.push(this.data.id)
    }
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

  receiveEmitRunning(data: any) {
    this.emitRunning.emit(data);
  }

  change(key, value) {
    const changeFn = key + "OnChange"
    if (this[changeFn] == undefined) {
      return
    }
    this[changeFn](value)
  }

  getCodeMarkdown(command, text) {
    return "```" + command + "\n" + text + "\n```";
  }

  // public nameOnChange(value) {
  //   if (value && value !== "") {
  //     const newData = {
  //       name: this.data.name,
  //       exe: this.data.exe || 'function',
  //       input: this.data.input || "{}",
  //       output: this.data.output || "{}",
  //       description: this.data.description || "This is a python function"
  //     }
  //     switch (this.data.exe) {
  //       case 'query':
  //         newData["text"] = this.data.text;
  //         break;
  //       case 'function':
  //         newData["text"] = this.data.text;
  //         newData["args"] = this.data.data ? this.data.data.args || "" : "";
  //         newData["command"] = this.data.data ? this.data.data.command || "python" : "python";
  //         break
  //       case 'pipe':
  //       case 'async':
  //         newData["steps"] = this.data.data || this.data.steps;
  //         break;
  //       case 'foreach':
  //         newData["step"] = this.data.data || this.data.step;
  //         break
  //       case 'JOB':
  //         try {
  //           newData["text"] = JSON.stringify(JSON.parse(this.data.data.data), null, 2);
  //         } catch {
  //           newData["text"] = this.data.data.data;
  //         }
  //         newData["cronExpr"] = this.data.data.cronExpr;
  //         newData["exeName"] = this.data.data.exeName;
  //         newData["exeType"] = this.data.data.exeType;
  //         newData["enabled"] = this.data.data.enabled;
  //         break;
  //     }
  //     this.data = newData;
  //   }
  // }

  public exeOnChange(value) {
    switch (value) {
      case "query":
        if (this.data.name === "" && value !== this.prevExe)  {
          this.data = new InitData(this.iam).query()
          this.prevExe = value;
        }
        break
      case "function":
        if (this.data.name === "" && value !== this.prevExe)  {
          this.data = new InitData(this.iam).function();
          this.prevExe = value;
        }
        break;
      case "graph": 
        if (this.data.name === "" && value !== this.prevExe)  {
          this.data = new InitData(this.iam).graph();
          this.prevExe = value;
        }
        break;
    }
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

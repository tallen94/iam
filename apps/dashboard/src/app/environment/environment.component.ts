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
  private prevData: any = {};
  private options = {
    maxLines: 32,
    wrap: true,
    autoScrollEditorIntoView: true,
    fontSize: "18px"
  }

  constructor(private iam: Iam) { }

  ngOnInit() {
    this.prevData = JSON.parse(JSON.stringify(this.data))
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

  applyKubernetes() {
    // this.iam.runExecutable("admin", "function", "kubectl-apply", { file: this.data.name })
    // .subscribe((result) => {
    //   console.log(result)
    // })
  }

  buildImage() {
    // const tag = this.data.imageRepo + ":" + this.data.name;
    // this.iam.runExecutable("admin", "function", "build-image", { tag: tag, image: this.data.name})
    // .subscribe((result) => {
    //   console.log(result)
    // })
  }
}

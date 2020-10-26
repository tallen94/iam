import { Component, OnInit, Input } from '@angular/core';
import { Iam } from '../iam/iam';

@Component({
  selector: 'job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {

  @Input() data: any;
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
    this.prevData = this.data
  }

  enableJob() {
    this.iam.enableJob(this.data.username, this.data.name)
    .subscribe((result: any) => {
      this.data.enabled = result.enabled
    })
  }

  disableJob() {
    this.iam.disableJob(this.data.username, this.data.name)
    .subscribe((result: any) => {
      this.data.enabled = result.enabled
    })
  }

  save() {
    this.iam.addJob(this.data)
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

}

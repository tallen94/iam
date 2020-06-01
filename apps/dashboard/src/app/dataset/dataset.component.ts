import { Component, OnInit, Input } from '@angular/core';
import { Iam } from '../iam/iam';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.css']
})
export class DatasetComponent implements OnInit {

  @Input() data: any;
  public loadingDataset: boolean = false;
  public editing: boolean = false;
  private prevData: any = {}

  constructor(private iam: Iam, private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
    this.prevData = JSON.parse(JSON.stringify(this.data))
  }

  save() {
    this.iam.addDataset(this.data)
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

  loadDataset() {
    this.loadingDataset = true;
    this.spinnerService.show()
    this.iam.loadDataset(this.data.username, this.data.cluster, this.data.environment, this.data.name, this.data.query)
    .subscribe((result) => {
      console.log(result)
      this.loadingDataset = false;
      this.spinnerService.hide()
    })
  }

  transformDataset() {

  }
}

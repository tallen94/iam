import { Component, OnInit, Input } from '@angular/core';
import { Iam } from '../iam/iam';
import { NgxSpinnerService } from 'ngx-spinner';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.css']
})
export class DatasetComponent implements OnInit {

  @Input() data: any;
  public query: any;
  public dataPreview: any;
  public dataPreviewColumns: string[]
  public dataPreviewTag: string;
  public loadingDataset: boolean = false;
  public editing: boolean = false;
  private prevData: any = {}

  constructor(private iam: Iam, private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
    console.log(this.data)
    this.prevData = JSON.parse(JSON.stringify(this.data))
    if (this.data.tag.length > 0) {
      this.dataPreviewTag = this.data.tag[0]
      this.iam.readDataset(this.data.username, this.data.cluster, this.data.environment, this.data.name, this.dataPreviewTag, 5)
      .subscribe((result) => {
        console.log(result)
        this.dataPreview = result;
        this.dataPreviewColumns = Object.keys(this.dataPreview[0])
      })
    }
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
      this.data = result
      this.loadingDataset = false;
      this.spinnerService.hide()
      this.dataPreviewTag = this.data.tag[this.data.tag.length - 1]
      this.iam.readDataset(this.data.username, this.data.cluster, this.data.environment, this.data.name, this.dataPreviewTag, 5)
      .subscribe((result) => {
        this.dataPreview = result;
        this.dataPreviewColumns = Object.keys(this.dataPreview[0])
      })
    })
  }

  selectDataPreviewTag(value: string) {
    this.iam.readDataset(this.data.username, this.data.cluster, this.data.environment, this.data.name, value, 5)
    .subscribe((result) => {
      this.dataPreview = result;
      this.dataPreviewColumns = Object.keys(this.dataPreview[0])
    })
  }

  deleteDatasetTag(value: string) {
    this.iam.deleteDatasetTag(this.data.username, this.data.cluster, this.data.environment, this.data.name, value)
    .subscribe((result) => {
      this.data = result
      if (this.data.tag.length > 0) {
        this.dataPreviewTag = this.data.tag[this.data.tag.length - 1]
        this.iam.readDataset(this.data.username, this.data.cluster, this.data.environment, this.data.name, this.dataPreviewTag, 5)
        .subscribe((result) => {
          this.dataPreview = result;
          this.dataPreviewColumns = Object.keys(this.dataPreview[0])
        })
      } else {
        this.dataPreviewTag = undefined
        this.dataPreview = undefined
        this.dataPreviewColumns = undefined
      }
    })
  }

  transformDataset() {

  }
}

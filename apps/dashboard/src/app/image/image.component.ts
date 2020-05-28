import { Component, OnInit, Input } from '@angular/core';
import { Iam } from '../iam/iam';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {

  @Input() data: any;

  public buildingImage: boolean = false;
  public editing: boolean = false;
  public prevData: any;
  public buildResult: string;
  private options = {
    maxLines: 32,
    wrap: true,
    autoScrollEditorIntoView: true,
    fontSize: "18px"
  }

  constructor(private iam: Iam, private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
    this.prevData = JSON.parse(JSON.stringify(this.data))
  }

  save() {
    this.iam.addImage(this.data)
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

  buildImage() {
    this.spinnerService.show()
    this.buildingImage = true;
    this.buildResult = undefined;
    this.iam.buildImage(this.data.username, this.data.name)
    .subscribe((result: any) => {
      this.spinnerService.hide()
      this.buildingImage = false;
      if (result.image) {
        this.data = result.image;
        this.buildResult = result.result;
      }
    })
  }
}

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() data: any;
  @Input() editing: boolean;
  private options = {
    maxLines: 32,
    wrap: true,
    autoScrollEditorIntoView: true
  }

  constructor() { }

  ngOnInit() {
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
    return str == undefined || str == '';
  }

}

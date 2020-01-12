import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hidden-header',
  templateUrl: './hidden-header.component.html',
  styleUrls: ['./hidden-header.component.css']
})
export class HiddenHeaderComponent implements OnInit {
  @Input() data: any;
  @Input() editing: boolean;

  constructor() { }

  ngOnInit() {
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
    return str == undefined || str == '';
  }

}

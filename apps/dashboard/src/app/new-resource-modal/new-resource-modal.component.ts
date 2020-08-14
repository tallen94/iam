import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'new-resource-modal',
  templateUrl: './new-resource-modal.component.html',
  styleUrls: ['./new-resource-modal.component.css']
})
export class NewResourceModalComponent implements OnInit {

  @Input() type: string;
  @Input() clusterOptions: string[]
  @Input() environmentOptions: string[]
  @Input() data: any;
  @Output() newResourceMoalDone: EventEmitter<any> = new EventEmitter();
  @Output() newResourceModalCancel: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    if (this.data == undefined) {
      this.data = {}
    }
  }

  done() {
    this.data.exe = this.type;
    this.data.name = this.data.name.toLowerCase()
    this.newResourceMoalDone.emit(this.data)
    this.data = {}
  }

  cancel() {
    this.newResourceModalCancel.emit();
  }

}

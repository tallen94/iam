import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'new-resource-modal',
  templateUrl: './new-resource-modal.component.html',
  styleUrls: ['./new-resource-modal.component.css']
})
export class NewResourceModalComponent implements OnInit {

  @Input() type: string;
  @Output() newResourceMoalDone: EventEmitter<any> = new EventEmitter();
  @Output() newResourceModalCancel: EventEmitter<any> = new EventEmitter();
  public data: any = {};

  constructor() { }

  ngOnInit() {
  }

  done() {
    this.data.exe = this.type;
    this.newResourceMoalDone.emit(this.data)
  }

  cancel() {
    this.newResourceModalCancel.emit();
  }

}

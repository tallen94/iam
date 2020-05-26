import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Iam } from '../iam/iam';

@Component({
  selector: 'add-trust-modal',
  templateUrl: './add-trust-modal.component.html',
  styleUrls: ['./add-trust-modal.component.css']
})
export class AddTrustModalComponent implements OnInit {

  @Input() resource: string;
  @Output() emitDone: EventEmitter<any> = new EventEmitter();
  @Output() emitCancel: EventEmitter<any> = new EventEmitter();
  public resource_from: string;
  
  constructor(private iam: Iam) { }

  ngOnInit() {
  }

  done() {
    this.emitDone.emit({resource_from: this.resource_from, resource_to: this.resource, visibility: "none", privileges: []})
  }

  cancel() {
    this.emitCancel.emit()
  }
}

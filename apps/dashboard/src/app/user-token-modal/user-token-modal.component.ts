import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-token-modal',
  templateUrl: './user-token-modal.component.html',
  styleUrls: ['./user-token-modal.component.css']
})
export class UserTokenModalComponent implements OnInit {

  @Output() emitDone: EventEmitter<any> = new EventEmitter();
  @Input() token: any;

  constructor() { }

  ngOnInit() {
  }

  done() {
    this.emitDone.emit()
  }

}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'new-executable',
  templateUrl: './new-executable.component.html',
  styleUrls: ['./new-executable.component.css']
})
export class NewExecutableComponent implements OnInit {
  @Output() emitCreateExecutable: EventEmitter<any> = new EventEmitter();
  @Output() emitCancelCreateExecutable: EventEmitter<any> = new EventEmitter();

  data: any = {}

  constructor() { }

  ngOnInit() {
  }

  public create() {
    this.emitCreateExecutable.emit(this.data)
  }

  public cancel() {
    this.emitCancelCreateExecutable.emit();
  }

}

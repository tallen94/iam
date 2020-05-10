import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Iam } from '../iam/iam';
import { InitData } from '../iam/init-data';

@Component({
  selector: 'cluster',
  templateUrl: './cluster.component.html',
  styleUrls: ['./cluster.component.css']
})
export class ClusterComponent implements OnInit {

  private _data: any;
  @Output() authorizationUpdated: EventEmitter<any> = new EventEmitter();
  @Output() addEnvironmentEvent: EventEmitter<any> = new EventEmitter();
  public environments: any[] = [];
  public editing: boolean = false;
  private prevData: any = {};
  private options = {
    maxLines: 32,
    wrap: true,
    autoScrollEditorIntoView: true,
    fontSize: "18px"
  }

  constructor(private iam: Iam) { }

  ngOnInit() {
    this.prevData = JSON.parse(JSON.stringify(this.data))
  }

  @Input()
  set data(data: any) {
    this._data = data
    this.iam.getEnvironmentForCluster(this.data.username, this.data.name)
    .subscribe((results: any[]) => {
      console.log(results)
      this.environments = results;
    })
  }

  get data() {
    return this._data;
  }

  getResource() {
    return ["cluster", this.data.username, this.data.name].join(".")
  }

  save() {
    this.iam.addCluster(this.data)
    .subscribe((result) => {
      this.editing = false;
    })
  }

  cancelEdit() {
    this.editing = false
    this.data = JSON.parse(JSON.stringify(this.prevData));
  }

  triggerEdit() {
    this.editing = true
    this.prevData = JSON.parse(JSON.stringify(this.data));
  }

  receiveTrustUpdated(authorizationList: any[]) {
    this.data.authorization = authorizationList
    this.authorizationUpdated.emit(this.data)
  }

  addEnvironment() {
    this.addEnvironmentEvent.emit()
  }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Iam } from "../iam/iam";
import * as Lodash from "lodash";
import { InitData } from '../iam/init-data';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  _data: any;
  @Input() clusterOptions: string[]
  @Input() environmentOptions: string[]
  @Output() emitCreateNewExecutable: EventEmitter<any> = new EventEmitter();
  @Output() emitSelectExecutable: EventEmitter<any> = new EventEmitter();
  editing: any[] = [];
  hidden: any[] = [];
  running: any;

  constructor(
    private iam: Iam,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.hidden.push(this.data.id)
  }

  @Input()
  set data(value: any) {
    this.running = undefined;
    this._data = value;
  }

  get data() {
    return this._data
  }
  
  public keys(obj: any) {
    return Lodash.map(obj, (value, key) => {
      return key;
    })
  }

  public receiveEmitRunning(data: any) {
    this.running = data;
  }

  public receiveEmitEditing(data: any) {
    this.editing = [...data]
    this.addHidden(this.editing)
  }

  public receiveEmitHidden(data: any) {
    this.hidden = [...data];
  }

  public receiveEmitNewNode(data: any) {
    this.iam.getExecutable(this.iam.getUser().username, data.cluster, data.environment, data.exe, data.name)
    .subscribe((executable: any) => {
      if (executable == undefined) {
        executable = this.initData(data);
        this.iam.addExecutable(executable).subscribe((result) => {
          executable.id = data.id
          this.data.graph.nodes.push(executable)
          this.saveGraph(this.data)
        })
      } else {
        executable.id = data.id
        this.data.graph.nodes.push(executable)
        this.saveGraph(this.data)
      }
    })
  }

  public saveGraph(data: any) {
    this.iam.addExecutable(data).subscribe((graph) => {
      this.data = JSON.parse(JSON.stringify(this.data))
    })
  }

  public receiveEmitNewEdge(edge: any) {
    this.data.graph.edges.push(edge);
    this.saveGraph(this.data)
  }

  public receiveUpdateData(data: any) {
    this.data = data
  }

  public receiveAddEnvironmentEvent(value: any) {
    this.emitCreateNewExecutable.emit(value)
  }

  public receiveNewResourceEvent(value: any) {
    this.emitCreateNewExecutable.emit(value)
  }

  public receiveDeleteEditing(linksEditing: any) {
    // Remove all editing links
    Lodash.each(linksEditing, (link: any) => {
      Lodash.remove(this.data.graph.edges, (edge: any) => {
        return edge.source == link.source && edge.target == link.target;
      })
    })

    // Remove all editing nodes
    Lodash.each(this.editing, (id) => {
      Lodash.remove(this.data.graph.nodes, (node: any) => {
        return node.id == id;
      })
      Lodash.remove(this.data.graph.edges, (edge: any) => {
        return edge.source == id || edge.target == id
      })
      Lodash.remove(this.hidden, (hiddenId: any) => {
        return hiddenId == id;
      })
    })
    this.saveGraph(this.data)
    this.editing = []
  }

  public receiveSelectExecutable(value: any) {
    this.emitSelectExecutable.emit(value)
  }

  private initData(data: any) {
    return new InitData(this.iam)[data.exe](data.id, data);
  }

  private addHidden(values: any[]) {
    Lodash.each(values, (value) => {
      if (Lodash.indexOf(this.hidden, value) == -1) {
        this.hidden.push(value);
      }
    });
    this.hidden = [...this.hidden]
  }
}

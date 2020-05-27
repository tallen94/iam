import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

import * as Lodash from "lodash";
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  public _nodes: any;
  public _links: any;
  public newNodeType: string;
  @Input() environment: string;
  @Input() cluster: string;
  @Input() editing: any[];
  @Input() edgesEditing: any[];
  @Input() clusterOptions: string[];
  @Input() environmentOptions: string[]
  @Output() emitEditing: EventEmitter<any> = new EventEmitter();
  @Output() emitNewNode: EventEmitter<any> = new EventEmitter();
  @Output() emitNewEdge: EventEmitter<any> = new EventEmitter();
  @Output() emitDeleteEditing: EventEmitter<any> = new EventEmitter();

  zoomToFit$: Subject<boolean> = new Subject();
  center$: Subject<boolean> = new Subject();
  white = "#FFFFFF";
  public layoutSettings = {
    orientation: "TB"
  }

  constructor() { }

  ngOnInit() { }

  @Input()
  set nodes(data: any) {
    this._nodes = this.getNodes(data)
  }

  get nodes() {
    return this._nodes;
  }

  @Input()
  set links(data: any) {
    this._links = data;
  }

  get links() {
    return this._links;
  }
  
  receiveEmitEditing(data: any) {
    this.editing = data;
  }

  isEdgeSelected(edge: any) {
    return Lodash.some(this.edgesEditing, {source: edge.source, target: edge.target});
  }

  selectEdge(edge: any) {
    if (this.isEdgeSelected(edge)) {
      Lodash.remove(this.edgesEditing, (item) => edge.source == item.source && edge.target == item.target)
    } else {
      this.edgesEditing.push({source: edge.source, target: edge.target})
    }
    this.edgesEditing = [...this.edgesEditing];
  }

  isSelected(node) {
    return Lodash.indexOf(this.editing, node.id) != -1;
  }

  select(node) {
    if (this.isSelected(node)) {
      Lodash.remove(this.editing, (item) => item == node.id)
    } else {
      this.editing.push(node.id)
    }
    this.editing = [...this.editing];
    this.emitEditing.emit(this.editing);
  }

  fitGraph() {
    this.zoomToFit$.next(true);
    this.center$.next(true);
  }

  dataToGraph(data: any) {
    const graph = {
      nodes: this.getNodes(data.nodes),
      links: data.edges
    };
    return graph;
  }

  getNodes(nodes: any[]) {
    return Lodash.map(nodes, (node) => {
      return { id: node.id, label: node.name, exe: node.exe }
    })
  }

  linkEditing() {
    for (let i = 0; i < this.editing.length - 1; i++) {
      const newEdge = { source: this.editing[i], target: this.editing[i+1] }
      this.emitNewEdge.emit(newEdge);
    }
  }

  newNode(exe: string) {
    this.newNodeType = exe;
  }

  maxId(nodes: any[]) {
    return Lodash.maxBy(nodes, (node) => node.id);
  }

  deleteEditing() {
    this.emitDeleteEditing.emit(this.edgesEditing);
    this.edgesEditing = []
  }
  
  getNewData() {
    return {}
  }

  receiveNewResourceModalDone(data: any) {
    const newNodeId = "" + (this._nodes.length == 0 ? 1 : (parseInt(this.maxId(this._nodes).id) + 1));
    data.id = newNodeId
    this.emitNewNode.emit(data);
    
    if (this.editing.length == 1) {
      const newEdge = { source: this.editing[0], target: newNodeId }
      this.emitNewEdge.emit(newEdge);
    }
    this.editing.push(newNodeId)
    this.editing = [...this.editing]
    this.emitEditing.emit(this.editing)
    this.newNodeType = undefined;
  }

  receiveNewResourceModalCancel() {
    this.newNodeType = undefined;
  }
}

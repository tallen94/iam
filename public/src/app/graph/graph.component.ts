import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

import * as Lodash from "lodash";

@Component({
  selector: 'graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  @Input() data: any;
  @Input() editing: any[];
  @Input() edgesEditing: any[];
  @Output() emitEditing: EventEmitter<any> = new EventEmitter();

  zoomToFit$: Subject<boolean> = new Subject();
  center$: Subject<boolean> = new Subject();
  white = "#FFFFFF";
  private layoutSettings = {
    orientation: "TB"
  }

  private graph: any;

  constructor() { }

  ngOnInit() {
    this.graph = this.dataToGraph(this.data)
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

  getGraph(stepJson: any, graph: any) {
    switch (stepJson.exe) {
      case "foreach":
        return graph.nodes.concat(this.getGraph(stepJson.step, graph))
      case "pipe":
        Lodash.each(stepJson.steps, (step) => {
          graph.nodes = graph.nodes.concat(this.getGraph(step, graph));
        });
      case "async": 
        Lodash.each(stepJson.steps, (step) => {
          graph.nodes = graph.nodes.concat(this.getGraph(step, graph));
        });
        return graph;
      default:
        graph.nodes = [{id: graph.nodes.length, label: stepJson.name, exe: stepJson.exe}]
        return graph
    }
  }

  linkEditing() {
    if (this.editing.length == 1) {
      const newNode = {id: "" + (this.graph.nodes.length + 1), label: "NewNode", exe: "function"};
      this.graph.nodes.push(newNode)
      this.graph.nodes = [...this.graph.nodes]
      this.graph.links.push({ source: this.editing[0], target: newNode.id })
      this.graph.links = [...this.graph.links]
    } else {
      for (let i = 0; i < this.editing.length - 1; i++) {
        this.graph.links.push({ source: this.editing[i], target: this.editing[i+1] })
      }
      this.graph.links = [...this.graph.links]
    }
  }

  deleteEditing() {
    Lodash.each(this.edgesEditing, (edge) => {
      Lodash.remove(this.graph.links, (link: any) => {
        return edge.source == link.source && edge.target == link.target;
      });
      this.graph.links = [...this.graph.links]
    });

    Lodash.each(this.editing, (id) => {
      Lodash.remove(this.graph.nodes, (node: any) => {
        return node.id === id
      });
      this.graph.nodes = [...this.graph.nodes]
      Lodash.remove(this.graph.links, (link: any) => {
        return link.source == id || link.target == id
      })
      this.graph.links = [...this.graph.links]
    })
    this.editing = []
  }
}

import { Component, OnInit, Input } from '@angular/core';
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
  @Input() data: any;
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
    const newNode = this.initData(data.id, data.exe, "New" + data.exe);
    this.data.graph.nodes.push(newNode)
    this.data.graph.nodes = [...this.data.graph.nodes]
  }

  public receiveEmitNewEdge(edge: any) {
    this.data.graph.edges.push(edge);
    this.data.graph.edges = [...this.data.graph.edges]  
  }

  public receiveUpdateData(data: any) {
    this.data = data
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
    this.data.graph.nodes = [...this.data.graph.nodes];
    this.data.graph.edges = [...this.data.graph.edges];
    this.editing = []
  }

  private initData(id: string, exe: string, name: string) {
    return new InitData(this.iam)[exe](id, name);
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

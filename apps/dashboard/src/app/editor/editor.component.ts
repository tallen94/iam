import { Component, OnInit } from '@angular/core';
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
  data: any;
  editing: any[] = [];
  hidden: any[] = [];
  running: any;

  constructor(
    private iam: Iam,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    const name = this.route.snapshot.params["name"]
    const exe = this.route.snapshot.params["exe"]
    const username = this.route.snapshot.params["username"]
    if (name !== undefined && name !== "" && exe !== undefined && exe !== "") {  
      this.iam.getExecutable(username, exe, name)
      .subscribe((result) => {
        if (result) {
          this.data = result;
        } else {
          this.data = this.initData(exe, name)
        }
      })
    } else {
      this.data = this.initData(exe, name)
    }
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
  }

  public receiveEmitNewNode(data: any) {
    const newNode = this.initData(data.exe, "NewNode");
    newNode["id"] = data.id
    this.data.graph.nodes.push(newNode)
    this.data.graph.nodes = [...this.data.graph.nodes]
  }

  public receiveEmitNewEdge(edge: any) {
    this.data.graph.edges.push(edge);
    this.data.graph.edges = [...this.data.graph.edges]  
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
    })
    this.data.graph.nodes = [...this.data.graph.nodes];
    this.data.graph.edges = [...this.data.graph.edges];
    this.editing = []
  }

  public delete() {
    this.iam.runExecutable("admin", "QUERY", "delete-exe", this.data)
    .subscribe((response) => {
      this.router.navigate(["/home"]);
    });
  }

  private initData(exe, name) {
    return new InitData(this.iam)[exe](1, name);
  }
}

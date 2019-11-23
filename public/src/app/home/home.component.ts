import { Component, OnInit } from '@angular/core';
import { Iam } from '../iam/iam';
import * as Lodash from "lodash";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public columns: any;
  public iam: Iam;
  public selected: string;

  constructor(iam: Iam) {
    this.iam = iam;
    this.columns = this.initColumns();
    this.selected = "function";
  }

  ngOnInit() {
    this.iam.getExecutables(this.iam.getUser().username, "function").subscribe((data) => {
      this.columns["function"]["list"] = data;
    })
    this.iam.getExecutables(this.iam.getUser().username, "query").subscribe((data) => {
      this.columns["query"]["list"] = data;
    })
    this.iam.getExecutables(this.iam.getUser().username, "graph").subscribe((data) => {
      this.columns["graph"]["list"] = data;
    })
  }

  private initColumns() {
    return { 
      function: {
        title: 'function',
        list: []
      }, 
      query: {
        title: 'query',
        list: []
      },
      graph: {
        title: 'graph',
        list: []
      }
    };
  }

  public select(selection: string) {
    this.selected = selection;
  }

  public values(obj: any) {
    return Lodash.map(obj, (value, key) => {
      return value;
    })
  }
}

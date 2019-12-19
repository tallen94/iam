import { Component, OnInit } from '@angular/core';
import { Iam } from '../iam/iam';
import * as Lodash from "lodash";
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public columns: any;
  public iam: Iam;
  public selected: string;
  public showNewDialog: boolean = false;

  constructor(iam: Iam, private router: Router) {
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

  public newExecutable() {
    this.showNewDialog = true;

  }

  public receiveCreateExecutable(data: any) {
    this.showNewDialog = false;
    this.router.navigateByUrl("editor/" + this.iam.getUser().username + "/" + data.exe + "/" + data.name)
  }

  public receiveCancelCreateExecutable() {
    this.showNewDialog = false;
  }
}

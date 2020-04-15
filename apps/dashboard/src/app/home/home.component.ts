import { Component, OnInit } from '@angular/core';
import { Iam } from '../iam/iam';
import * as Lodash from "lodash";
import { Router } from '@angular/router';
import { InitData } from '../iam/init-data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public columns: any;
  public iam: Iam;
  public data: any;
  public showNewDialog: boolean = false;
  public searchText: string = "";
  public showAll: boolean = false;

  constructor(iam: Iam, private router: Router) {
    this.iam = iam;
    this.columns = this.initColumns();
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
    this.iam.getExecutables(this.iam.getUser().username, "environment").subscribe((data) => {
      this.columns["environment"]["list"] = data
    })
    // this.iam.getExecutables(this.iam.getUser().username, "pool").subscribe((data) => {
    //   this.columns["pool"]["list"] = data
    // })
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
      },
      environment: {
        title: 'environment',
        list: []
      },
      // pool: {
      //   title: 'pool',
      //   list: []
      // }
    };
  }

  public select(exe: string, selection: any) {
    this.data = null;
    this.iam.getExecutable(selection.username, exe, selection.name)
    .subscribe((result) => {
      this.data = result;
      this.data.id = this.data.exe == "graph" ? "0" : "1";
    })
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
    this.data = this.initData("0", data.exe, data.name)
    this.columns[data.exe].list.push(this.data)
  }

  public receiveCancelCreateExecutable() {
    this.showNewDialog = false;
  }

  public filter(values: any[]) {
    return Lodash.orderBy(Lodash.filter(values, (item) => {
      return item.name.includes(this.searchText)
    }), ["name"]);
  }

  public hide(title: string) {
    this.columns[title].hidden = !this.columns[title].hidden
  }

  public searching(value: string) {
    if (value == "") {
      this.showAll = false;
    } else {
      this.showAll = true;
    }
  }

  private initData(id: string, exe: string, name: string) {
    return new InitData(this.iam)[exe](id, name);
  }

}

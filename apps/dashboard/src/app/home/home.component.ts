import { Component, OnInit, HostListener } from '@angular/core';
import { Iam } from '../iam/iam';
import * as Lodash from "lodash";
import { Router } from '@angular/router';
import { InitData } from '../iam/init-data';

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37
}

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
  private backHistory: any[] = [];
  private forwardHistory: any[] = [];

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
    this.iam.getEnvironmentForUser(this.iam.getUser().username).subscribe((data) => {
      this.columns["environment"]["list"] = data
    })
    this.iam.getClusterForUser(this.iam.getUser().username).subscribe((data) => {
      this.columns["cluster"]["list"] = data
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
      },
      environment: {
        title: 'environment',
        list: []
      },
      cluster: {
        title: 'cluster',
        list: []
      }
    };
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {

    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      this.forwards();
    }

    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      this.backwards();
    }
  }

  public select(exe: string, selection: any) {
    this.data = selection;
    this.data.exe = exe;

    if (this.backHistory.length > 0) {
      const last = this.backHistory[this.backHistory.length - 1]
      if (last.name !== this.data.name || last.exe !== this.data.exe || last.username !== this.data.username) {
        this.backHistory.push(this.data)
      }
    } else {
      this.backHistory.push(this.data)
    }

    if (this.backHistory.length > 10) {
      this.backHistory.shift()
    }
    // this.iam.getExecutable(selection.username, exe, selection.name)
    // .subscribe((result) => {
    //   this.data = result;
    //   this.data.id = this.data.exe == "graph" ? "0" : "1";
    // })
  }

  public receieveSelectExecutable(value: any) {
    console.log(value)
    this.select(value.exe, value)
  }

  public backwards() {
    if (this.backHistory.length > 1) {
      this.forwardHistory.push(this.backHistory.pop())
      this.data = this.backHistory[this.backHistory.length - 1]
    }
    if (this.forwardHistory.length > 10) {
      this.forwardHistory.shift()
    }
    
  }

  public forwards() {
    if (this.forwardHistory.length > 0) {
      this.backHistory.push(this.forwardHistory.pop())
      this.data = this.backHistory[this.backHistory.length - 1]
    }
    if (this.backHistory.length > 10) {
      this.backHistory.shift()
    }
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
    this.backHistory.push(this.data)
    if (this.backHistory.length > 10) {
      this.backHistory.shift()
    }
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

  public delete() {
    this.iam.deleteExecutable(this.data.username, this.data.exe, this.data.name)
    .subscribe((response) => {
      this.data = undefined;
    });
  }

}

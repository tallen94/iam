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

  public clusters: any[];
  public environments: any[];
  public images: any[];
  public functions: any[];
  // public queries: any[];
  public graphs: any[];
  // public datasets: any[];
  public jobs: any[];
  public secrets: any[];

  public iam: Iam;
  public data: any;
  public showNewDialog: string;
  public searchText: string = "";
  public showAll: boolean = false;
  public show: string = "";
  private backHistory: any[] = [];
  private forwardHistory: any[] = [];

  constructor(iam: Iam, private router: Router) {
    this.iam = iam;
  }

  ngOnInit() {
    this.iam.getExecutables(this.iam.getUser().username, "function").subscribe((data: any[]) => {
      this.functions = data;
    })
    // this.iam.getExecutables(this.iam.getUser().username, "query").subscribe((data: any[]) => {
    //   this.queries = data;
    // })
    this.iam.getExecutables(this.iam.getUser().username, "graph").subscribe((data: any[]) => {
      this.graphs = data;
    })
    this.iam.getImageForUser(this.iam.getUser().username).subscribe((data: any[]) => {
      this.images = data;
    })
    this.iam.getEnvironmentForUser(this.iam.getUser().username).subscribe((data: any[]) => {
      this.environments = data
    })
    this.iam.getClusterForUser(this.iam.getUser().username)
    .subscribe((data: any[]) => {
      this.clusters = data
    })
    // this.iam.getDatasetForUser(this.iam.getUser().username).subscribe((data: any[]) => {
    //   this.datasets = data
    // })
    this.iam.getJobsForUser(this.iam.getUser().username).subscribe((data: any[]) => {
      this.jobs = data
    })
    this.iam.getSecretsForUser(this.iam.getUser().username).subscribe((data: any[]) => {
      this.secrets = data;
    })

  }

  private initColumns() {
    return { 
      // function: {
      //   title: 'function',
      //   list: []
      // }, 
      // query: {
      //   title: 'query',
      //   list: []
      // },
      // graph: {
      //   title: 'graph',
      //   list: []
      // },
      // environment: {
      //   title: 'environment',
      //   list: []
      // },
      cluster: {
        title: 'cluster',
        list: []
      }
    };
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {

    // if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
    //   this.forwards();
    // }

    // if (event.keyCode === KEY_CODE.LEFT_ARROW) {
    //   this.backwards();
    // }
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

  public newResource(value: string) {
    this.showNewDialog = value;
  }

  public receiveNewResourceModalDone(data: any) {
    this.showNewDialog = undefined;
    this.data = new InitData(this.iam)[data.exe]("0", data);
    switch (data.exe) {
      case "cluster":
        this.clusters.push(this.data)
        break;
      case "environment":
        this.environments.push(this.data)
        break;
      case "function":
        this.functions.push(this.data)
        break;
      // case "query":
      //   this.queries.push(this.data)
      //   break;
      case "graph":
        this.graphs.push(this.data)
        break;
      case "image":
        this.images.push(this.data)
      // case "dataset":
      //   this.datasets.push(this.data)
      case "job":
        this.jobs.push(this.data)
      case "secret":
        this.secrets.push(this.data)
    }

    this.backHistory.push(this.data)
    if (this.backHistory.length > 10) {
      this.backHistory.shift()
    }
  }

  public receiveNewResourceModalCancel() {
    this.showNewDialog = undefined;
  }

  public filter(values: any[]) {
    return Lodash.orderBy(Lodash.filter(values, (item) => {
      return item.name.includes(this.searchText)
    }), ["name"]);
  }

  public searching(value: string) {
    if (value == "") {
      this.showAll = false;
    } else {
      this.showAll = true;
    }
  }

  public getNewData() {
    return {};
  }

  public delete() {
    // this.iam.deleteExecutable(this.data.username, this.data.exe, this.data.name)
    // .subscribe((response) => {
    //   this.data = undefined;
    // });
  }

  public showGroup(group: string) {
    this.show = group;
  }

}

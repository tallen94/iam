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
    this.iam.getClusterForUser(this.iam.getUser().username).subscribe((data) => {
      this.columns["cluster"]["list"] = data
      console.log(data)
    })
    // this.columns["cluster"]["list"] = [{
    //   name: "MachineLearningCluster",
    //   username: "trevor",
    //   exe: "cluster",
    //   description: "This is a cluster created by the machine learning team and has a bunch of cool ML related stuff. I use this in my marketing and fraud clusters",
    //   trusts: [{
    //     requestor: this.iam.getUser().username,
    //     requestor_type: "user",
    //     visibility: "write",
    //     privileges: [{name: "execute", value: true}]
    //   },{
    //     requestor: "JoeBob (MLE)",
    //     requestor_type: "user",
    //     visibility: "write",
    //     privileges: [{name: "execute", value: true}]
    //   },{
    //     requestor: "Marketing Cluster",
    //     requestor_type: "cluster",
    //     visibility: "none",
    //     privileges: [{name: "execute", value: true}]
    //   },{
    //     requestor: "Fraud Cluster",
    //     requestor_type: "cluster",
    //     visibility: "none",
    //     privileges: [{name: "execute", value: true}]
    //   }]
    // },{
    //   name: "MarketingCluster",
    //   username: "trevor",
    //   exe: "cluster",
    //   description: "This is a cluster created by me for the marketing team to do marketing stuff.",
    //   trusts: [{
    //     requestor: this.iam.getUser().username,
    //     requestor_type: "user",
    //     visibility: "write",
    //     privileges: [{name: "execute", value: true}]
    //   },{
    //     requestor: "MarketingTeamUser1",
    //     requestor_type: "user",
    //     visibility: "write",
    //     privileges: [{name: "execute", value: true}]
    //   }]
    // },{
    //   name: "FraudCluster",
    //   username: "trevor",
    //   exe: "cluster",
    //   description: "This is a cluster created by me for the fraud team to catch fraud.",
    //   trusts: [{
    //     requestor: this.iam.getUser().username,
    //     requestor_type: "user",
    //     visibility: "write",
    //     privileges: [{name: "execute", value: true}]
    //   },{
    //     requestor: "FraudTeamUser1",
    //     requestor_type: "user",
    //     visibility: "write",
    //     privileges: [{name: "execute", value: true}]
    //   }]
    // },{
    //   name: "RobinhoodCluster",
    //   username: "Robinhood",
    //   exe: "cluster",
    //   description: "This is a cluster created by some person that extended the Robinhood API.",
    //   trusts: [{
    //     requestor: "Robinhood",
    //     requestor_type: "user",
    //     visibility: "write",
    //     privileges: [{name: "execute", value: true}]
    //   },{
    //     requestor: this.iam.getUser().username,
    //     requestor_type: "user",
    //     visibility: "read",
    //     privileges: [{name: "execute", value: false}]
    //   },{
    //     requestor: "Stock Broker Cluster",
    //     requestor_type: "cluster",
    //     visibility: "none",
    //     privileges: [{name: "execute", value: true}]
    //   }]
    // },{
    //   name: "StockBrokerCluster",
    //   username: "trevor",
    //   exe: "cluster",
    //   description: "I use this cluster to build a stock broker.",
    //   trusts: [{
    //     requestor: this.iam.getUser().username,
    //     requestor_type: "user",
    //     visibility: "write",
    //     privileges: [{name: "execute", value: true}]
    //   }]
    // },{
    //   name: "TheFrancisFriesCluster",
    //   username: "FrancisFries",
    //   exe: "cluster",
    //   description: "A cluster created by Francis Fries",
    //   trusts: [{
    //     requestor: this.iam.getUser().username,
    //     requestor_type: "user",
    //     visibility: "write",
    //     privileges: [{name: "execute", value: true}]
    //   },{
    //     requestor: "FrancisFries",
    //     requestor_type: "user",
    //     visibility: "write",
    //     privileges: [{name: "execute", value: true}]
    //   },{
    //     requestor: "MarketingTeamUser1",
    //     requestor_type: "user",
    //     visibility: "read",
    //     privileges: [{name: "execute", value: false}]
    //   }]
    // }]
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
      cluster: {
        title: 'cluster',
        list: []
      }
      // pool: {
      //   title: 'pool',
      //   list: []
      // }
    };
  }

  public select(exe: string, selection: any) {
    this.data = selection;
    this.data.exe = exe;

    // this.iam.getExecutable(selection.username, exe, selection.name)
    // .subscribe((result) => {
    //   this.data = result;
    //   this.data.id = this.data.exe == "graph" ? "0" : "1";
    // })
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

import { Component, OnInit } from '@angular/core';
import { Iam } from '../iam/iam';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  private rootNode: any;
  host: string;
  port: number;

  constructor(private iam: Iam) { 
    this.rootNode = {};
  }

  ngOnInit() {
    this.getStatus();
  }

  getStatus() {
    this.iam.getStatus()
    .subscribe((response) => {
      this.rootNode = response;
    })
  }

  addClient() {
    this.iam.addClient(this.host, this.port)
    .subscribe((response) => {
      console.log(response);
      return this.getStatus();
    })
  }
}

import { Component, OnInit } from '@angular/core';
import { Iam } from '../iam/iam';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent implements OnInit {

  public searchText: string = "";
  private results: any = [];
  private iam: Iam;

  constructor(iam: Iam) { 
    this.iam = iam;
  }

  ngOnInit() {
  }

  search() {
    this.iam.searchExecutables(this.searchText)
    .subscribe((results) => {
      this.results = results;
    }) 
  }

  resultKeys() {
    return Object.keys(this.results);
  }

}

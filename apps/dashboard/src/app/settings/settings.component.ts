import { Component, OnInit, Input } from '@angular/core';
import { Iam } from '../iam/iam';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  public tokens: any[];
  public newToken: any;

  constructor(private iam: Iam) { }

  ngOnInit() {
    this.iam.getUserTokens(this.iam.getUser().username).subscribe((data: any[]) => {
      this.tokens = data;
    })
  }

  addToken() {
    this.iam.addUserToken(this.iam.getUser().username)
    .subscribe((result) => {
      this.newToken = result
    })
  }

  deleteToken(index: number) {
    this.iam.deleteUserToken(this.tokens[index].tokenId)
    .subscribe((result) => {
      this.tokens.splice(index, 1)
    })
  }

  receiveSecretDone() {
    this.tokens.push({tokenId: this.newToken.tokenId})
    this.newToken = undefined;
  }
}

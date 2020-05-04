import { Component, OnInit, Input } from '@angular/core';
import { Iam } from '../iam/iam';
import * as Lodash from "lodash";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  public data = {
    tokens: [],
    authorizations: []
  }
  public prevData: any;
  public newToken: any;
  private editing: boolean = false;

  constructor(private iam: Iam) {
  }

  ngOnInit() {
    this.prevData = JSON.parse(JSON.stringify(this.data))
    this.iam.getUserTokens(this.iam.getUser().username).subscribe((data: any[]) => {
      this.data.tokens = data;
    })
  }

  addToken() {
    this.iam.addUserToken(this.iam.getUser().username)
    .subscribe((result) => {
      this.newToken = result
    })
  }

  deleteToken(index: number) {
    this.iam.deleteUserToken(this.data.tokens[index].tokenId)
    .subscribe((result) => {
      this.data.tokens.splice(index, 1)
    })
  }

  receiveSecretDone() {
    this.data.tokens.push({tokenId: this.newToken.tokenId})
    this.newToken = undefined;
  }

  receiveAddAuthorization(authorization: any) {
    this.data.authorizations.push(authorization)
  }

  receiveTrustUpdated(authorizationList: any[]) {
    this.data.authorizations = authorizationList
  }

  getResource() {
    return ["account", this.iam.getUser().username].join(".")
  }
}

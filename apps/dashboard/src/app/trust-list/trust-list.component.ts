import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Iam } from '../iam/iam';

@Component({
  selector: 'trust-list',
  templateUrl: './trust-list.component.html',
  styleUrls: ['./trust-list.component.css']
})
export class TrustListComponent implements OnInit {

  private _resource: string;
  public data: any;
  public newAuthorization: boolean;
  public privileges: any[] = ["execute"]

  constructor(private iam: Iam) { }

  @Input()
  set resource(value: any) {
    this._resource = value
    this.iam.getAuthorizationForResource(this.resource)
    .subscribe((result) => {
      this.data = result
    })
  }

  get resource() {
    return this._resource
  }

  ngOnInit() {
  }

  addAuthorization() {
    this.newAuthorization = true
  }

  deleteAuthorization(authorization: any, index: number) {
    this.iam.deleteAuthorization(authorization.resource_from, authorization.resource_to)
    .subscribe((result) => {
      this.data.splice(index, 1)
    })
  }

  receiveNewAuthorizationDone(data: any) {
    this.data.push(data)
    this.newAuthorization = false;
    this.iam.addAuthorization(data.resource_from, data.resource_to, "none")
    .subscribe((result) => {
      console.log(result)
    })
  }

  receiveNewAuthorizationCancel() {
    this.newAuthorization = false;
  }

  privilegeChange(authorization: any, p: string) {
    if (this.privilegesContains(authorization, p)) {
      this.iam.deleteAuthorizationPrivilege(authorization.resource_from, authorization.resource_to, p)
      .subscribe((result) => {
        authorization.privileges = authorization.privileges.filter((item) => {
          return item !== p
        })
      })
    } else {
      this.iam.addAuthorizationPrivilege(authorization.resource_from, authorization.resource_to, p)
      .subscribe((result) => {
        authorization.privileges.push(p)
      })
    }
  }

  privilegesContains(authorization: any, p: string) {
    return authorization.privileges.includes(p)
  }

  visibilityChange(authorization: any, value: any) {
    this.iam.addAuthorization(authorization.resource_from, authorization.resource_to, value.target.value)
    .subscribe((result) => {
      authorization.visibility = value.target.value
    })
  }
}

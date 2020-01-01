import { Component } from '@angular/core';
import { Iam } from './iam/iam';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private iam: Iam,
    public router: Router
  ) {

  }

  logout() {
    const token = localStorage.getItem("token");
    this.iam.runExecutable("admin", "query", "delete-token", {token: token})
    .subscribe((result) => {
      localStorage.removeItem("token");
      this.router.navigate(["/login"])
    })
  }

  getUser() {
    if (this.iam !== undefined && this.iam.getUser() !== undefined && this.iam.getUser().username !== undefined) {
      return "(" + this.iam.getUser().username + ")";
    } 
    return "";
  }
}

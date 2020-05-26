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
    public iam: Iam,
    public router: Router
  ) {
    const token = localStorage.getItem("token");
    if (token !== null) {
      this.iam.validateUserSession(token)
      .subscribe((result: any) => {
        if (!result.error) {
          this.iam.setUser(result.username, token);
          this.router.navigate(["/home"]);
        } else {
          localStorage.removeItem("token")
          this.router.navigate(["/login"])
        }
      });
    } else {
      localStorage.removeItem("token")
      this.router.navigate(["/login"])
    }
  }

  logout() {
    const token = localStorage.getItem("token");
    this.iam.deleteUserSession(token)
    .subscribe((result) => {
      this.iam.unsetUser()
      localStorage.removeItem("token");
      this.router.navigate(["/login"])
    })
  }

  settings() {
    this.router.navigate(["/settings"])
  }

  home() {
    this.router.navigate(["/home"])
  }

  getUser() {
    if (this.iam !== undefined && this.iam.getUser() !== undefined && this.iam.getUser().username !== undefined) {
      return "(" + this.iam.getUser().username + ")";
    } 
    return "";
  }
}

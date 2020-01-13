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
      this.iam.runExecutable("admin", "graph", "validate-token", [{token: token}])
      .subscribe((result: any) => {
        if (result.result.length > 0) {
          const user = result.result[0];
          this.iam.setUser(user.username, token);
          this.router.navigate(["/home"]);
        }
      });
    }
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

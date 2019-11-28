import { Component, OnInit } from '@angular/core';
import { Iam } from '../iam/iam';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email: string;
  public password: string;
  public username: string;

  constructor(private iam: Iam, private router: Router) { }

  ngOnInit() {
    const token = localStorage.getItem("token");
    if (token !== null) {
    this.iam.runExecutable("admin", "graph", "validate-token", [{token: token}])
    .subscribe((result: any) => {
      if (result.result.length > 0) {
        const user = result.result[0];
        this.iam.setUser(user.username, user.userId, token);
        this.router.navigate(["/home"]);
      }
    });
    }
  }

  login() {
    this.iam.runExecutable("admin", "graph", "gen-token", [{email: this.email}, {password: this.password}])
    .subscribe((result: any) => {
      if (result.result.length > 0) {
        const user = result.result[0];
        this.iam.setUser(user.username, user.userId, user.token);
        localStorage.setItem("token", user.token);
        this.router.navigate(["/home"])
      }
    });
  }

  signup() {
    this.iam.runExecutable("admin", "graph", "add-user", [{email: this.email, username: this.username, password: this.password}])
    .subscribe((result: any) => {
      if (result.result.length > 0) {
        const user = result.result[0];
        this.iam.setUser(user.username, user.userId, user.token);
        localStorage.setItem("token", user.token);
        this.router.navigate(["/home"])
      }
    });
  }
}

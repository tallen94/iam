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

  ngOnInit() { }

  login() {
    this.iam.runExecutable("admin", "graph", "gen-token", [{email: this.email}, {password: this.password}])
    .subscribe((result: any) => {
      if (result.result) {
        const user = result.result;
        this.iam.setUser(user.username, user.token);
        localStorage.setItem("token", user.token);
        this.router.navigate(["/home"])
      }
    });
  }

  signup() {
    this.iam.runExecutable("admin", "graph", "add-user", {email: this.email, username: this.username, password: this.password})
    .subscribe((result: any) => {
      if (result.result) {
        const user = result.result;
        this.iam.setUser(user.username, user.token);
        localStorage.setItem("token", user.token);
        this.router.navigate(["/home"])
      }
    });
  }
}

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
  public status: string = "";

  constructor(private iam: Iam, private router: Router) { }

  ngOnInit() { }

  returning() {
    this.status = "returning"
  }

  new() {
    this.status = "new"
  }

  continue() {
    if (this.status === "returning") {
      this.login()
    }

    if (this.status === "new") {
      this.signup()
    }
  }

  login() {
    this.iam.addUserSession(this.username.toLowerCase(), this.password)
    .subscribe((result: any) => {
      if (result.token) {
        this.iam.setUser(this.username, result.token);
        localStorage.setItem("token", result.token);
        this.router.navigate(["/home"])
      }
    });
  }

  signup() {
    this.iam.addUser(this.username.toLowerCase(), this.email, this.password)
    .subscribe((result: any) => {
      if (result.success) {
        this.login()
      }
    });
  }
}

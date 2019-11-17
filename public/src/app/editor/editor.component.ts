import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Iam } from "../iam/iam";
import * as Lodash from "lodash";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  data: any;
  selected: any;
  editing: any[] = [];
  hidden: any[] = [];
  running: any;

  constructor(
    private iam: Iam,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    const name = this.route.snapshot.params["name"]
    const exe = this.route.snapshot.params["exe"]
    const username = this.route.snapshot.params["username"]
    if (name !== undefined && name !== "" && exe !== undefined && exe !== "") {
      this.iam.getExecutable(username, exe, name)
      .subscribe((result) => {
        console.log(result);
        this.data = result;
        this.selected = this.data;
      })
    } else {
      this.data = {
        name: "",
        exe: "function"
      }
      this.selected = this.data;
    }
  }
  
  public keys(obj: any) {
    return Lodash.map(obj, (value, key) => {
      return key;
    })
  }

  public receiveEmitRunning(data: any) {
    this.running = data;
  }

  receiveEmitEditing(data: any) {
    this.editing = [...data]
  }

  public delete() {
    this.iam.runExecutable("admin", "QUERY", "delete-exe", this.data)
    .subscribe((response) => {
      console.log(response);
      this.router.navigate(["/home"]);
    });
  }
}

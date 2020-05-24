import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Iam } from '../iam/iam';
import { InitData } from '../iam/init-data';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() data: any;
  @Input() editing: boolean;
  @Input() showForeach: boolean;
  @Output() emitUpdateData: EventEmitter<any> = new EventEmitter();
  private prevExe: string = "";
  private options = {
    maxLines: 32,
    wrap: true,
    autoScrollEditorIntoView: true,
    fontSize: "18px"
  }
  searchResults: any = {}

  constructor(private iam: Iam) {
  }

  ngOnInit() { }

  public nameOnChange(value) {
    if (value !== "") {
      this.iam.searchExecutables(value + "%")
      .subscribe((result) => {
        this.searchResults = result;
      })
    } else {
      this.searchResults = []
    }
  }

  public clickSearchResult(result) {
    this.iam.getExecutable(result.username, result.exe, result.name)
    .subscribe((data) => {
      this.searchResults = []
      this.emitUpdateData.emit(data);
    })
  }
  
  public exeOnChange(value) {
    switch (value) {
      case "query":
        if (this.data.name === "" && value !== this.prevExe)  {
          this.emitUpdateData.emit(new InitData(this.iam).query(this.data.id, { name: "NewQuery" }))
          this.prevExe = value;
        }
        break
      case "function":
        if (this.data.name === "" && value !== this.prevExe)  {
          this.emitUpdateData.emit(new InitData(this.iam).function(this.data.id, { name: "NewFunction" }))
          this.prevExe = value;
        }
        break;
      case "graph": 
        if (this.data.name === "" && value !== this.prevExe)  {
          this.emitUpdateData.emit(new InitData(this.iam).graph("0", { name: "NewGraph" }))
          this.prevExe = value;
        }
        break;
    }
  }

  inputSize(key: string) {
    if (key && this.data[key]) {
      if ((this.data[key].length) < 8) {
        return 8
      }

      return this.data[key].length
    }
    return 8;
  }

  isEmpty(str: string) {
    return str == undefined || str == '';
  }

  keys(obj: any) {
    return Object.keys(obj)
  }

}

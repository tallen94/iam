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
  @Output() emitUpdateData: EventEmitter<any> = new EventEmitter();
  private prevExe: string = "";
  private options = {
    maxLines: 32,
    wrap: true,
    autoScrollEditorIntoView: true,
    fontSize: "18px"
  }

  constructor(private iam: Iam) { }

  ngOnInit() { }

  public nameOnChange(value) {
    if (value !== "") {
      this.iam.getExecutable(this.iam.getUser().username, this.data.exe, value)
      .subscribe((result) => {
        if (result != null) {
          this.emitUpdateData.emit(result)
        }
      })
    }
  }
  
  public exeOnChange(value) {
    switch (value) {
      case "query":
        if (this.data.name === "" && value !== this.prevExe)  {
          this.emitUpdateData.emit(new InitData(this.iam).query(this.data.id))
          this.prevExe = value;
        }
        break
      case "function":
        if (this.data.name === "" && value !== this.prevExe)  {
          this.emitUpdateData.emit(new InitData(this.iam).function(this.data.id))
          this.prevExe = value;
        }
        break;
      case "graph": 
        if (this.data.name === "" && value !== this.prevExe)  {
          this.emitUpdateData.emit(new InitData(this.iam).graph())
          this.prevExe = value;
        }
        break;
    }
  }

  inputSize(key: string) {
    if (key && this.data[key]) {
      if ((this.data[key].length) < 5) {
        return 5
      }

      return this.data[key].length
    }
    return 5;
  }

  isEmpty(str: string) {
    return str == undefined || str == '';
  }

}

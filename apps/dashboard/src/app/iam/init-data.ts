import { Iam } from './iam';

export class InitData {

  constructor(private iam: Iam) { }

  query(id: string) {
    return {
      id: id,
      username: this.iam.getUser().username,
      exe: "query",
      name: "NewQuery",
      description: "This is a mysql query. These are used to get data or save data.",
      input: "",
      output: "",
      text: ""
    }
  }

  function(id: string) {
    return {
      id: id,
      username: this.iam.getUser().username,
      exe: "function",
      name: "NewFunction",
      description: "This is a python program. I require input from stdin and I write my output to stdout.",
      input: '{"value":"example"}',
      output: '{"value":"example"}',
      args: "",
      command: "python",
      text: "import json\n\nargs = raw_input()\ndata = json.loads(args)\nout={}\nprint json.dumps(out)"
    }
  }

  graph() {
    return {
      id: "0",
      username: this.iam.getUser().username,
      exe: "graph",
      name: "NewGraph",
      description: "",
      input: '',
      output: '',
      graph: {
        nodes: [new InitData(this.iam)["function"]("1")],
        edges: []
      }
    }
  }
}
import { Iam } from './iam';

export class InitData {

  constructor(private iam: Iam) { }

  query(id: string, name: string) {
    return {
      id: id,
      username: this.iam.getUser().username,
      exe: "query",
      name: name,
      description: "This is a mysql query. These are used to get data or save data.",
      input: "",
      output: "",
      text: "",
      environment: "base"
    }
  }

  function(id: string, name: string) {
    return {
      id: id,
      username: this.iam.getUser().username,
      exe: "function",
      name: name,
      description: "This is a python program. I require input from stdin and I write my output to stdout.",
      input: '{"value":"example"}',
      output: '{"value":"example"}',
      args: "",
      command: "python",
      text: "import json\n\nargs = raw_input()\ndata = json.loads(args)\nout={}\nprint json.dumps(out)",
      environment: "base"
    }
  }

  graph(id: string, name: string) {
    return {
      id: id,
      username: this.iam.getUser().username,
      exe: "graph",
      name: name,
      description: "",
      input: '',
      output: '',
      environment: "base",
      graph: {
        nodes: [new InitData(this.iam)["function"]("1", "NewFunction")],
        edges: []
      }
    }
  }

  environment(id: number, name: string) {
    return {
      id: id,
      username: this.iam.getUser().username,
      exe: "environment",
      name: name,
      description: "This is an environment.",
      input: "",
      output: "",
      host: "localhost",
      port: "5000",
      image: "FROM icanplayguitar94/iam:base-latest",
      environment: "base"
    }
  }
}
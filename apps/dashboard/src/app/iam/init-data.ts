import { Iam } from './iam';

export class InitData {

  constructor(private iam: Iam) { }

  query(id: string, data: any) {
    return {
      id: id,
      username: this.iam.getUser().username,
      exe: "query",
      name: data.name,
      description: "This is a mysql query. These are used to get data or save data.",
      input: "",
      output: "",
      text: "",
      environment: data.environment,
      cluster: data.cluster,
      visibility: "private"
    }
  }

  function(id: string, data: any) {
    return {
      id: id,
      username: this.iam.getUser().username,
      exe: "function",
      name: data.name,
      description: "This is a python program. I require input from stdin and I write my output to stdout.",
      input: '{"value":"example"}',
      output: '{"value":"example"}',
      args: "",
      command: "python",
      text: "import json\n\nargs = raw_input()\ndata = json.loads(args)\nout={}\nprint json.dumps(out)",
      environment: data.environment,
      cluster: data.cluster,
      visibility: "private"
    }
  }

  graph(id: string, data: any) {
    return {
      id: id,
      username: this.iam.getUser().username,
      exe: "graph",
      name: data.name,
      description: "",
      input: '',
      output: '',
      environment: data.environment,
      cluster: data.cluster,
      graph: {
        nodes: [],
        edges: []
      },
      visibility: "private"
    }
  }

  environment(id: number, data: any) {
    return {
      id: id,
      username: this.iam.getUser().username,
      exe: "environment",
      name: data.name,
      cluster: data.cluster,
      description: "This is an environment.",
      kubernetes: "",
      state: "STOPPED",
      data: {
        replicas: 1,
        cpu: "500m",
        memory: "500Mi",
        type: "executor"
      }
    }
  }

  image(id: string, data: any) {
    return {
      id: id,
      username: this.iam.getUser().username,
      exe: "image",
      name: data.name,
      description: "This is an image. These are used to create sets of dependencies.",
      input: "",
      output: "",
      imageRepo: "icanplayguitar94/iam",
      imageTag: "",
      image: "FROM icanplayguitar94/iam:base-latest",
    }
  }

  pool(id: number, data: any) {
    return {
      id: id,
      username: this.iam.getUser().username,
      exe: "pool",
      name: data.name,
      environment: "base",
      description: "This is pool.",
      input: "",
      output: "",
      executableName: "",
      executableExe: "",
      executableUsername: "",
      size: 0,
      visibility: "private"
    }
  }

  cluster(id: number, data: any) {
    return {
      id: id,
      username: this.iam.getUser().username, 
      exe: "cluster",
      name: data.name,
      description: "This is a cluster",
      authorization: []
    }
  }
}
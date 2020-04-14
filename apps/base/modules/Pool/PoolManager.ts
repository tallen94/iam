import { Executor } from "../Executor/Executor";
import * as Lodash from "lodash";
import * as uuid from "uuid";
import { FileSystem } from "../FileSystem/FileSystem";
import { Droplet } from "./Droplet";
import { Shell } from "../Executor/Shell";
import { Database } from "../Executor/Database";
import { GraphExecutor } from "../Executor/GraphExecutor";
import { ExecutableFactory } from "../Executable/ExecutableFactory";
import { Query } from "../Executable/Query";
import { Graph } from "../Executable/Graph";

export class PoolManager {

  private pools: { [key: string]: Droplet[] } = {}

  constructor(
    private shell: Shell,
    private database: Database,
    private graphExecutor: GraphExecutor,
    private fileSystem: FileSystem,
    private environment: string,
    private executableFactory: ExecutableFactory
  ) {
    // this.initPools(environment)
  }

  private initPools(environment: string) {
    // return this.executableFactory.query({
    //   username: "admin", 
    //   name: "get-env-pools"
    // }).then((query: Query) => {
    //   return query.run({ environment: environment })
    // }).then((results) => {
    //   return Promise.all(Lodash.map(results, (pool) => {
    //     return this.initPool(pool)
    //   }))
    // })
  }

  private initPool(pool: any) {
    pool.data = JSON.parse(pool.data)
    return this.shell.getProgram(pool.data.username, pool.data.name)
    .then((result: any) => {
      return this.fileSystem.put("programs", pool.data.name, result.text)
      .then((err: any) => {
        return result;
      })
    }).then((program: any) => {
      const key = program.username + "." + program.name + "." + program.exe
      this.pools[key] = []

      for (let i = 0; i < pool.data.poolSize; i++) {
        const droplet = new Droplet(
          this.shell.getShellCommunicator(), 
          program,
          this.fileSystem) 
        droplet.activate({})
        this.pools[key].push(droplet)
      }
    })
  }

  public hasPool(username: string, name: string, exe: string) {
    const key = username + "." + name + "." + exe;
    return this.pools[key] != undefined;
  }

  public useDroplet(username: string, name: string, exe: string, data: any) {
    const key = username + "." + name + "." + exe;
    return new Promise((resolve, reject) => {
      do {
        if (this.pools[key].length > 0) {
          const droplet = this.pools[key].shift()
          return droplet.pipe(JSON.stringify(data))
          .then((result) => {
            const newDroplet = droplet.clone()
            droplet.activate({})
            this.pools[key].push(newDroplet)
            resolve(result);
          })
        }
      }
      while (this.pools[key].length == 0)
    })
  }

  public addPool(data: any) {
    // const poolData = JSON.stringify({ 
    //   username: data.executableUsername,
    //   exe: data.executableExe,
    //   name: data.executableName,
    //   poolSize: data.poolSize
    // })
    // return this.getPool(data.username, data.name)
    // .then((result) => {
    //   if (result == undefined) {
    //     return this.executableFactory.query({
    //       username: "admin", 
    //       name: "add-exe"
    //     }).then((query: Query) => {
    //       return query.run({
    //         username: data.username, 
    //         name: data.name,
    //         uuid: uuid.v4(),
    //         exe: data.exe,
    //         data: poolData,
    //         input: data.input,
    //         output: data.output,
    //         description: data.description,
    //         environment: data.environment,
    //         visibility: data.visibility
    //       })
    //     })
    //   }
    //   return this.executableFactory.query({
    //     username: "admin", 
    //     name: "update-exe"
    //   }).then((query: Query) => {
    //     return query.run({ 
    //       name: data.name,
    //       exe: data.exe,
    //       data: poolData,
    //       input: data.input,
    //       output: data.output,
    //       description: data.description,
    //       environment: data.environment,
    //       visibility: data.visibility
    //     })
    //   })
    // }).then(() => {
    //   return this.executableFactory.graph({
    //     username: "admin", 
    //     name: "update-env-pool"
    //   }).then((graph: Graph) => {
    //     return graph.run([{svc: this.environment}, {username: data.username, name: data.name}])
    //   })
    // })
  }

  public getPool(username: string, name: string) {
    // return this.executableFactory.query({
    //   username: "admin", 
    //   name: "get-exe-by-type-name"
    // }).then((query: Query) => {
    //   return query.run({ username: username, name: name, exe: "pool" })
    // }).then((result) => {
    //   if (result.length > 0) {
    //     const item = result[0];
    //     const data = JSON.parse(item.data);
    //     const ret = {
    //       username: item.username,
    //       name: item.name,
    //       exe: item.exe,
    //       description: item.description,
    //       input: item.input,
    //       output: item.output,
    //       executableUsername: data.username,
    //       executableExe: data.exe,
    //       executableName: data.name,
    //       poolSize: data.poolSize
    //     }
    //     return ret;
    //   }
    //   return undefined;
    // })
  }

  public getPools(username: string) {
    // return this.executableFactory.query({
    //   username: "admin", 
    //   name: "get-exe-for-user"
    // }).then((query: Query) => {
    //   return query.run({ exe: "pool", username: username })
    // }).then((data) => {
    //   return Promise.all(Lodash.map(data, (item) => {
    //     return {
    //       username: item.username,
    //       name: item.name,
    //       description: item.description
    //     }
    //   }))
    // })
  }

  public runPool(username: string, name: string, data: any) {
    // return this.executableFactory.query({
    //   username: "admin", 
    //   name: "get-exe-by-type-name"
    // }).then((query: Query) => {
    //   return query.run({username: username, name: name, exe: "pool"})
    // }).then((result) => {
    //   return this.initPool(result[0])
    // })
  }
}
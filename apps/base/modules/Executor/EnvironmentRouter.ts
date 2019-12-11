import { ClientCommunicator } from "../Communicator/ClientCommunicator";
import { ApiPaths } from "../Api/ApiPaths";
import { Database } from "./Database";

export class EnvironmentRouter {

  constructor(
    private database: Database
  ) { }

  public runExecutable(exe: string, username: string, name: string, data: any) {
    return this.database.runQuery('admin', 'get-exe-env', {username: username, name: name, exe: exe})
    .then((results) => {
      if (results.length > 0) {
        const env = results[0];
        const client: ClientCommunicator = new ClientCommunicator(env.host, env.port)
        return client.post(ApiPaths.RUN_EXECUTABLE, data, {username: username, exe: exe, name: name});
      }
    })
  }
}
import {
  ServerCommunicator,
  ApiPaths,
  Executor
} from "../modules";
import { AuthenticationClient } from "../Client/AuthenticationClient";
import { AuthData } from "../Auth/AuthData";
import { SecretClient } from "../Client/SecretClient";

import * as Lodash from "lodash";

export class ExecutorApi {

  constructor(
    private executor: Executor,
    private serverCommunicator: ServerCommunicator,
    private authenticationClient: AuthenticationClient,
    private secretClient: SecretClient) {
    this.init();
  }

  private init(): void {
    /**
     * Execute an executable.
     *
     * path: /executable/:username/:cluster/:environment/:exe/:name/run
     * method: POST
     */
    this.serverCommunicator.post(ApiPaths.RUN_EXECUTABLE, (req: any, resp: any) => {
      const username = req.params.username;
      const cluster = req.params.cluster;
      const environment = req.params.environment;
      const exe = req.params.exe;
      const name = req.params.name;
      const data = req.body;
      const authData = AuthData.fromHeaders(req.headers)
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.hydrateSecrets(username, data, authData)
        .then((hydratedData) => {
          this.executor.runExecutable(username, cluster, environment, exe, name, hydratedData, authData)
          .then((result: any) => {
            resp.status(200).send({result: result});
          });
        })
      }, (error) => {
        resp.status(400).send({ result: error })
      })
    });
  }

  private hydrateSecrets(username: string, data: any, authData: AuthData) {
    return Promise.all(Lodash.map(Object.keys(data), (key) => {
      if (data[key] === "$secret") {
        return this.secretClient.getSecret(key, username, authData)
        .then((result: any) => {
          return [key, result.value]
        })
      }
      return Promise.resolve([key, data[key]])
    })).then((results: any[]) => {
      const ret = {}
      Lodash.each(results, (item) => {
        ret[item[0]] = item[1]
      })
      return ret
    })
  }
}
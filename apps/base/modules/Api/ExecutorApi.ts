import {
  ServerCommunicator,
  ApiPaths,
  Executor
} from "../modules";
import { AuthenticationClient } from "../Client/AuthenticationClient";
import { AuthData } from "../Auth/AuthData";

export class ExecutorApi {

  constructor(
    private executor: Executor,
    private serverCommunicator: ServerCommunicator,
    private authenticationClient: AuthenticationClient) {
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
      this.authenticationClient.validateAuthData(req.headers, username, () => {
        this.executor.runExecutable(username, cluster, environment, exe, name, data, authData)
        .then((result: any) => {
          resp.status(200).send({result: result});
        });
      }, (error) => {
        resp.status(400).send({ result: error })
      })
    });
  }
}
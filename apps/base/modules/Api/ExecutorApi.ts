import {
  ServerCommunicator,
  ApiPaths,
  Executor
} from "../modules";

export class ExecutorApi {

  constructor(
    private executor: Executor,
    private serverCommunicator: ServerCommunicator) {
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
      this.executor.runExecutable(username, cluster, environment, exe, name, data)
      .then((result: any) => {
        resp.status(200).send({result: result});
      });
    });
  }
}
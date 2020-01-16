import {
  ServerCommunicator,
  ApiPaths,
  Executor
} from "../modules";

export class ExecutableApi {

  constructor(
    private executor: Executor,
    private serverCommunicator: ServerCommunicator) {
    this.init();
  }

  private init(): void {

    /**
     * Execute an executable.
     *
     * path: /executable/:username/:exe/:name/run
     * method: POST
     */
    this.serverCommunicator.post(ApiPaths.RUN_EXECUTABLE, (req: any, resp: any) => {
      const username = req.params.username;
      const name = req.params.name;
      const exe = req.params.exe;
      const data = req.body;
      this.executor.runExecutable(username, name, exe, data)
      .then((result: any) => {
        resp.status(200).send({result: result});
      });
    });
  }
}
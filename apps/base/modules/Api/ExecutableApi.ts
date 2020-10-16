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
     * path: /executable/:username/:cluster/:environment/:exe/:name/run
     * method: POST
     */
    this.serverCommunicator.post(ApiPaths.RUN_EXECUTABLE, (req: any, resp: any) => {
      const executable = req.body.executable;
      const data = req.body.data;
      this.executor.runExecutable(executable, data)
      .then((result: any) => {
        resp.status(200).send({result: result});
      });
    });
  }
}
import {
  ServerCommunicator,
  ApiPaths
} from "../modules";
import { EnvironmentRouter } from "../Executor/EnvironmentRouter";

export class EnvironmentRouterApi {

  constructor(
    private router: EnvironmentRouter,
    private serverCommunicator: ServerCommunicator) {
    this.init();
  }

  private init(): void {

    /**
     * Execute an executable.
     *
     * path: /master/:username/:exe/:name/run
     * method: POST
     */
    this.serverCommunicator.post(ApiPaths.RUN_EXECUTABLE, (req: any, resp: any) => {
      const username = req.params.username;
      const name = req.params.name;
      const exe = req.params.exe;
      const data = req.body;
      this.router.runExecutable(exe, username, name, data)
      .then((result: any) => {
        resp.status(200).send(result);
      });
    });
  }
}
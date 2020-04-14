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
     * Adds an executable to be executed on the node.
     *
     * path: /executable
     * method: POST
     * body: any
     */
    this.serverCommunicator.post(ApiPaths.ADD_EXECUTABLE, (req: any, res: any) => {
      const data = req.body;
      this.executor.addExecutable(data)
      .then((result: any) => {
        res.status(200).send(result);
      });
    });

    /**
     * Get an executable
     *
     * path: /executable/:username/:exe/:name
     * method: GET
     */
    this.serverCommunicator.get(ApiPaths.GET_EXECUTABLE, (req: any, res: any) => {
      const username = req.params.username;
      const exe = req.params.exe;
      const name = req.params.name;
      this.executor.getExecutable(username, name, exe)
      .then((result) => {
        res.status(200).send(result);
      });
    });

    /**
     * Get all executables
     *
     * path: /executable/:username/:exe
     * method: GET
     */
    this.serverCommunicator.get(ApiPaths.GET_EXECUTABLES, (req: any, res: any) => {
      const exe = req.params.exe;
      const username = req.params.username;
      this.executor.getExecutables(username, exe)
      .then((results) => {
        res.status(200).send(results);
      });
    });

    /**
     * Delete executables
     *
     * path: /executable/:username/:exe/:name
     * method: DELETE
     */
    this.serverCommunicator.delete(ApiPaths.DELETE_EXECUTABLE, (req: any, res: any) => {
      const exe = req.params.exe;
      const username = req.params.username;
      const name = req.params.name;
      this.executor.deleteExecutable(username, exe, name)
      .then((results) => {
        res.status(200).send(results);
      });
    });

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
      const token = req.headers.token;
      this.executor.runExecutable(username, name, exe, data, token)
      .then((result: any) => {
        resp.status(200).send({result: result});
      });
    });
  }
}
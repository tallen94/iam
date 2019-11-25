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
      const user = this.parseUser(req.headers);
      const data = req.body;
      this.executor.addExecutable(user.username, user.userId, data)
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
      const user = this.parseUser(req.headers);
      const username = req.params.username;
      const exe = req.params.exe;
      const name = req.params.name;
      this.executor.getExecutable(username, name, exe).then((result) => {
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
      const user = this.parseUser(req.headers);
      const exe = req.params.exe;
      const username = req.params.username;
      this.executor.getExecutables(username, exe)
      .then((results) => {
        res.status(200).send(results);
      });
    });

    /**
     * Search all executables
     *
     * path: /executable/search?searchText=string
     * method: GET
     */
    this.serverCommunicator.get(ApiPaths.SEARCH_EXECUTABLES, (req: any, res: any) => {
      const user = this.parseUser(req.headers);
      const searchText = req.query.searchText;
      this.executor.searchExecutables(searchText)
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
      const user = this.parseUser(req.headers);
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

  private parseUser(headers: any) {
    if (headers.user) {
      return JSON.parse(headers.user);
    }
    return {};
  }
}
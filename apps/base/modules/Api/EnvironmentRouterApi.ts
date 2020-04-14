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
     * Adds an executable to be executed on the node.
     *
     * path: /executable
     * method: POST
     * body: any
     */
    this.serverCommunicator.post(ApiPaths.ADD_EXECUTABLE, (req: any, res: any) => {
      const data = req.body;
      this.router.addExecutable(data)
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
      this.router.getExecutable(username, name, exe).then((result) => {
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
      this.router.getExecutables(username, exe)
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
      this.router.deleteExecutable(username, exe, name)
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
      const searchText = req.query.searchText;
      this.router.searchExecutables(searchText)
      .then((results) => {
        res.status(200).send(results);
      });
    });

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
      const token = req.headers.token;
      this.router.runExecutable(exe, username, name, data, token)
      .then((result: any) => {
        resp.status(200).send(result);
      });
    });
  }
}
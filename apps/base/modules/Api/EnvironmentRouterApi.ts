import {
  ServerCommunicator,
  ApiPaths
} from "../modules";
import { EnvironmentRouter } from "../Executor/EnvironmentRouter";
import { AuthenticationClient } from "../Client/AuthenticationClient";
import { AuthData } from "../Auth/AuthData";

export class EnvironmentRouterApi {

  constructor(
    private router: EnvironmentRouter,
    private serverCommunicator: ServerCommunicator,
    private authenticationClient: AuthenticationClient) {
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
      const authData = AuthData.fromHeaders(req.headers)
      this.authenticationClient.validateAuthData(authData, data.username, () => {
        this.router.addExecutable(data)
        .then((result: any) => {
          res.status(200).send(result);
        });
      }, (error) => {
        res.status(400).send(error)
      })
    });

    /**
     * Get an executable
     *
     * path: /executable/:username/:cluster/:environment/:exe/:name
     * method: GET
     */
    this.serverCommunicator.get(ApiPaths.GET_EXECUTABLE, (req: any, res: any) => {
      const username = req.params.username;
      const cluster = req.params.cluster;
      const environment = req.params.environment;
      const exe = req.params.exe;
      const name = req.params.name;
      const authData = AuthData.fromHeaders(req.headers)
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.router.getExecutable(username, cluster, environment, name, exe).then((result) => {
          res.status(200).send(result);
        });
      }, (error) => {
        res.status(400).send(error)
      })
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
      const authData = AuthData.fromHeaders(req.headers)
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.router.getExecutables(username, exe)
        .then((results) => {
          res.status(200).send(results);
        });
      }, (error) => {
        res.status(400).send(error)
      })
    });

    /**
     * Delete executables
     *
     * path: /executable/:username/:cluster/:environment/:exe/:name
     * method: DELETE
     */
    this.serverCommunicator.delete(ApiPaths.DELETE_EXECUTABLE, (req: any, res: any) => {
      const exe = req.params.exe;
      const username = req.params.username;
      const cluster = req.params.cluster;
      const environment = req.params.environment;
      const name = req.params.name;
      const authData = AuthData.fromHeaders(req.headers)
      this.authenticationClient.validateAuthData(authData, username, () => {
        this.router.deleteExecutable(username, cluster, environment, exe, name)
        .then((results) => {
          res.status(200).send(results);
        });
      }, (error) => {
        res.status(400).send(error)
      })
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
     * path: /master/:username/:cluster/:environment/:exe/:name/run
     * method: POST
     */
    this.serverCommunicator.post(ApiPaths.RUN_EXECUTABLE, (req: any, resp: any) => {
      const username = req.params.username;
      const cluster = req.params.cluster;
      const environment = req.params.environment;
      const name = req.params.name;
      const exe = req.params.exe;
      const data = req.body;
      const authData = AuthData.fromHeaders(req.headers)
      this.router.runExecutable(exe, username, cluster, environment, name, data, authData)
      .then((result: any) => {
        resp.status(200).send(result);
      });
    });
  }
}
import {
  ServerCommunicator,
  ApiPaths
} from "../modules";
import { EnvironmentManager } from "../Environment/EnvironmentManager";

export class EnvironmentApi {

  constructor(
    private environmentManager: EnvironmentManager,
    private serverCommunicator: ServerCommunicator) {
    this.init();
  }

  private init(): void {

    /**
     * /environment
     */
    this.serverCommunicator.post(ApiPaths.ADD_ENVIRONMENT, (req: any, res: any) => {
      this.environmentManager.addEnvironment(req.body)
      .then((result: any) => {
        res.status(200).send(result);
      });
    });

    /**
     * Get an environment
     *
     * path: /environment/:username/:name
     * method: GET
     */
    this.serverCommunicator.get(ApiPaths.GET_ENVIRONMENT, (req: any, res: any) => {
      const username = req.params.username;
      const name = req.params.name;
      this.environmentManager.getEnvironment(username, name).then((result) => {
        res.status(200).send(result);
      });
    });

    /**
     * Get all environments
     *
     * path: /environment/:username
     * method: GET
     */
    this.serverCommunicator.get(ApiPaths.GET_ENVIRONMENTS, (req: any, res: any) => {
      const username = req.params.username;
      this.environmentManager.getEnvironments(username)
      .then((results) => {
        res.status(200).send(results);
      });
    });
  }
}
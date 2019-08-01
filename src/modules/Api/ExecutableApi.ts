import {
  ServerCommunicator,
  ApiPaths,
  Executor
} from "../modules";
import { Logger } from "../Logger/Logger";

export class ExecutableApi {
  private serverCommunicator: ServerCommunicator;
  private executor: Executor;
  private logger: Logger;

  constructor(
    threadManager: Executor,
    serverCommunicator: ServerCommunicator,
    logger: Logger) {
    this.executor = threadManager;
    this.serverCommunicator = serverCommunicator;
    this.logger = logger;
    this.initApi();
  }

  private initApi(): void {

    /**
     * Adds an executable to be executed on the node.
     *
     * path: /executable/:token/:type/:name
     * method: POST
     * body: { data: any, dataType: string, dataModel: any }
     */
    this.serverCommunicator.post(ApiPaths.ADD_EXECUTABLE, (req: any, res: any) => {
      const user = this.parseUser(req.headers);
      const name = req.params.name;
      const type = req.params.type;
      const data = req.body.data;
      const dataType = req.body.dataType;
      const dataModel = req.body.dataModel;
      const userId = req.body.userId;
      const description = req.body.description;
      this.executor.addExecutable(type, name, data, dataType, dataModel, userId, description)
      .then((result: any) => {
        res.status(200).send(result);
      });
    });

    /**
     * Get an executable
     *
     * path: /executable/:token/:type/:name
     * method: GET
     */
    this.serverCommunicator.get(ApiPaths.GET_EXECUTABLE, (req: any, res: any) => {
      const user = this.parseUser(req.headers);
      const type = req.params.type;
      const name = req.params.name;
      this.executor.getExecutable(type, name).then((result) => {
        res.status(200).send(result);
      });
    });

    /**
     * Get all executables
     *
     * path: /executable/:token/:type
     * method: GET
     */
    this.serverCommunicator.get(ApiPaths.GET_EXECUTABLES, (req: any, res: any) => {
      const user = this.parseUser(req.headers);
      const type = req.params.type;
      this.executor.getExecutables(type, user.userId)
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
     * path: /executable/:token/:type/:name/run
     * method: POST
     */
    this.serverCommunicator.post(ApiPaths.RUN_EXECUTABLE, (req: any, resp: any) => {
      const user = this.parseUser(req.headers);
      const name = req.params.name;
      const type = req.params.type;
      const data = req.body;
      this.executor.runExecutable(type, name, data)
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
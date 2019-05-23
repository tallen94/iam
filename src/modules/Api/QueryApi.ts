import {
  ServerCommunicator,
  ApiPaths,
  Executor
} from "../modules";

export class QueryApi {
  private serverCommunicator: ServerCommunicator;
  private executor: Executor;

  constructor(
    threadManager: Executor,
    serverCommunicator: ServerCommunicator) {
    this.executor = threadManager;
    this.serverCommunicator = serverCommunicator;
    this.initApi();
  }

  private initApi(): void {

    /**
     * Add a query.
     *
     * path: /query/:name
     * method: POST
     * body: { query: string, dataType: string, dataModel: any }
     */
    this.serverCommunicator.post(ApiPaths.ADD_QUERY, (req: any, res: any) => {
      const name = req.params.name;
      const query = req.body.query;
      const dataType = req.body.dataType;
      const dataModel = req.body.dataModel;
      this.executor.addQuery(name, query, dataType, dataModel)
      .then((result: any) => {
        res.status(200).send({ database: result[0], clients: result[1] });
      });
    });

    /**
     * Execute a query.
     *
     * path: /query/:name/run
     * method: POST
     */
    this.serverCommunicator.post(ApiPaths.RUN_QUERY, (req: any, resp: any) => {
      const name = req.params.name;
      const data = req.body;
      this.executor.getDatabase().runQuery(name, data)
      .then((result: any) => {
        resp.status(200).send(result);
      });
    });

    /**
     * Get a query
     *
     * path: /query/:name
     * method: GET
     */
    this.serverCommunicator.get(ApiPaths.GET_QUERY, (req: any, res: any) => {
      this.executor.getQuery(req.params.name).then((result) => {
        res.status(200).send(result);
      });
    });

    /**
     * Get all queries
     *
     * path: /queries
     * method: GET
     */
    this.serverCommunicator.get(ApiPaths.GET_QUERIES, (req: any, res: any) => {
      this.executor.getQueries().then((results) => {
        res.status(200).send(results);
      });
    });
  }
}
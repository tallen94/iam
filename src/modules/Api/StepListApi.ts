import {
  ServerCommunicator,
  ApiPaths,
  Executor
} from "../modules";

export class StepListApi {
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
     * Add an async step list.
     *
     * path: /stepList/:name
     * method: POST
     * body: { data: string, dataType: string, dataModel: any }
     */
    this.serverCommunicator.post(ApiPaths.ADD_STEP_LIST, (req: any, resp: any) => {
      const name = req.params.name;
      const data = req.body.data;
      const dataType = req.body.dataType;
      const dataModel = req.body.dataModel;
      const userId = 12;
      this.executor.addStepList(name, data, dataType, dataModel, userId);
      resp.status(200).send("Added StepList: " + name);
    });

    /**
     * Get a SyncStepList
     *
     * path: /stepList/:name
     * method: GET
     */
    this.serverCommunicator.get(ApiPaths.GET_STEP_LIST, (req: any, res: any) => {
      this.executor.getStepList(req.params.name).then((result) => {
        res.status(200).send(result);
      });
    });

    /**
     * Get all SyncStepLists
     *
     * path: /stepList
     * method: GET
     */
    this.serverCommunicator.get(ApiPaths.GET_STEP_LISTS, (req: any, res: any) => {
      this.executor.getStepLists().then((result) => {
        res.status(200).send(result);
      });
    });

    /**
     * Run a step list.
     *
     * path: /stepList/:name
     * method: POST
     */
    this.serverCommunicator.post(ApiPaths.RUN_STEP_LIST, (req: any, resp: any) => {
      const name = req.params.name;
      const data = req.body;
      this.executor.getStepListManager().runStepList(name, data)
      .then((result) => {
        resp.status(200).send(result);
      });
    });
  }
}
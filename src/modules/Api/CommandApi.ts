import {
  ServerCommunicator,
  ApiPaths,
  Executor
} from "../modules";

export class CommandApi {
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
     * Adds a command to be executed on the node.
     *
     * path: /command/:name
     * method: POST
     * body: { command: string }
     */
    this.serverCommunicator.post(ApiPaths.ADD_COMMAND, (req: any, res: any) => {
      const name = req.params.name;
      const command = req.body.command;
      this.executor.addCommand(name, command)
      .then((result: any) => {
        res.status(200).send({ shell: result[0], clients: result[1] });
      });
    });

    /**
     * Get a command
     *
     * path: /command/:name
     * method: GET
     */
    this.serverCommunicator.get(ApiPaths.GET_COMMAND, (req: any, res: any) => {
      this.executor.getCommand(req.params.name).then((result) => {
        res.status(200).send(result);
      });
    });

    /**
     * Get all commands
     *
     * path: /command
     * method: GET
     */
    this.serverCommunicator.get(ApiPaths.GET_COMMANDS, (req: any, res: any) => {
      this.executor.getCommands().then((results) => {
        res.status(200).send(results);
      });
    });

    /**
     * Execute a command.
     *
     * path: /command/:name/run
     * method: POST
     */
    this.serverCommunicator.post(ApiPaths.RUN_COMMAND, (req: any, resp: any) => {
      const name = req.params.name;
      const data = req.body;
      this.executor.getShell().runCommand(name, data)
      .then((result: any) => {
        resp.status(200).send(result);
      });
    });
  }
}
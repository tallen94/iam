import {
  ServerCommunicator,
  ApiPaths
} from "../modules";

export class StatusApi {

  constructor(private serverCommunicator: ServerCommunicator) {
    this.initApi();
  }

  private initApi(): void {
    /**
     * Health check.
     *
     * path: /status
     * method: GET
     */
    this.serverCommunicator.get(ApiPaths.GET_STATUS, (req: any, res: any) => {
      res.status(200).send("okay");
    });
  }
}
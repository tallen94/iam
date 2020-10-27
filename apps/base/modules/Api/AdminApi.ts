import { ServerCommunicator } from "../Communicator/ServerCommunicator";
import { DatabaseManager } from "../Admin/DatabaseManager";
import { ApiPaths } from "./ApiPaths";

export class AdminApi {

  constructor(
    private serverCommunicator: ServerCommunicator, 
    private databaseManager: DatabaseManager) { 
      this.init()
  }

  private init() {

    this.serverCommunicator.post(ApiPaths.RUN_DATABASE_MIGRATIONS, (req: any, res: any) => {
      const adminToken = req.body.adminToken
      if (adminToken === process.env.ADMIN_TOKEN) {
        this.databaseManager.runMigrations()
        .then((result) => {
          res.status(200).send(result)
        })
      } else {
        res.status(400).send({ error: "invalid token" })
      }
    })

    this.serverCommunicator.post(ApiPaths.GET_DATABASE_MIGRATION_VERSION, (req: any, res: any) => {
      const adminToken = req.body.adminToken
      if (adminToken === process.env.ADMIN_TOKEN) {
        this.databaseManager.getMigrationVersion()
        .then((result) => {
          res.status(200).send(result)
        })
      } else {
        res.status(400).send({ error: "invalid token" })
      }
    })
  }
}
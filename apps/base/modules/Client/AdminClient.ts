import { ClientCommunicator } from "../Communicator/ClientCommunicator";
import { ApiPaths } from "../Api/ApiPaths";

export class AdminClient {

  constructor(public clientCommunicator: ClientCommunicator) {

  }

  public runDatabaseMigrations(adminToken: string) {
    return this.clientCommunicator.post(ApiPaths.RUN_DATABASE_MIGRATIONS, { adminToken: adminToken })
  }

  public getDatabaseMigrationVersion(adminToken: string) {
    return this.clientCommunicator.post(ApiPaths.GET_DATABASE_MIGRATION_VERSION, { adminToken: adminToken })
  }
}
import { DatabaseCommunicator } from "../Communicator/DatabaseCommunicator"
import { Queries } from "../Constants/Queries"
import { Migrations } from "./Migrations"

export class DatabaseManager {

  constructor(private databaseCommunicator: DatabaseCommunicator) {

  }

  public runMigrations() {
    return this.getMigrationVersion()
    .then((result) => {
      if (result) {
        // Run UP migrations
        if (result.version - Migrations.VERSION < 0) {
          return this.runUpMigrations(result.version)
        }

        // Run DOWN migrations
        if (result.version - Migrations.VERSION > 0) {
          return this.runDownMigrations(result.version)
        }

        return Promise.resolve({ result: "database is latest version: " + Migrations.VERSION })
      }
    })
  }

  private runUpMigrations(currentVersion: number): Promise<any> {
    let promise = Promise.resolve()
    for (let i = currentVersion; i < Migrations.VERSION; i++) {
      promise = promise.then(() => {
        return this.databaseCommunicator.execute(Migrations.UP[i+1], {})
      }).then(() => {
        return this.databaseCommunicator.execute(Queries.UPDATE_MIGRATION_VERSION, {version: i+1})
      })
    }
    return promise
  }

  private runDownMigrations(currentVersion: number): Promise<any> {
    let promise = Promise.resolve()
    for (let i = currentVersion; i > Migrations.VERSION; i--) {
      promise = promise.then(() => {
        return this.databaseCommunicator.execute(Migrations.DOWN[i-1], {})
      }).then(() => {
        return this.databaseCommunicator.execute(Queries.UPDATE_MIGRATION_VERSION, {version: i-1})
      })
    }
    return promise
  }

  public getMigrationVersion() {
    return this.databaseCommunicator.execute(Queries.GET_MIGRATION_VERSION, {})
    .then((result) => {
      if (result.length > 0) {
        return result[0]
      }
      return undefined
    })
  }
}
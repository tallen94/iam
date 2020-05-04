import { DatabaseCommunicator } from "../Communicator/DatabaseCommunicator";
import { Queries } from "../Constants/Queries";

export class ClusterManager {

  constructor(private databaseCommunicator: DatabaseCommunicator) {

  }

  public addCluster(data: any) {
    return this.getCluster(data.username, data.name)
    .then((result) => {
      if (result.length == 0) {
        return this.databaseCommunicator.execute(Queries.ADD_CLUSTER, data)
      }
      return this.databaseCommunicator.execute(Queries.UPDATE_CLUSTER, data)
    })
  }

  public getCluster(username: string, name: string) {
    return this.databaseCommunicator.execute(Queries.GET_CLUSTER, {name: name, username: username})
  }

  public getClusterForUser(username: string) {
    return this.databaseCommunicator.execute(Queries.GET_CLUSTER_FOR_USER, {username: username})
  }

  public deleteCluster(username: string, name: string) {
    return this.databaseCommunicator.execute(Queries.DELETE_CLUSTER, {name: name, username: username})
  }
}
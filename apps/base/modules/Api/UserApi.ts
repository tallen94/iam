import { ServerCommunicator } from "../Communicator/ServerCommunicator";
import { ApiPaths } from "./ApiPaths";
import { UserManager } from "../User/UserManager";

export class UserApi {

  constructor(
    private serverCommunicator: ServerCommunicator,
    private userManager: UserManager) {
    this.init();
  }

  private init(): void {

    this.serverCommunicator.post(ApiPaths.ADD_USER, (req: any, res: any) => {
      this.userManager.addUser(req.body.username, req.body.email)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_USER, (req: any, res: any) => {
      this.userManager.getUser(req.query.username)
      .then((result) => {
        res.status(200).send(result)
      })
    })
  }
}
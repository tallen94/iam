import { ServerCommunicator } from "../Communicator/ServerCommunicator";
import { ApiPaths } from "./ApiPaths";
import { Authorization } from "../Auth/Authorization";

export class AuthorizationApi {

  constructor(
    private serverCommunicator: ServerCommunicator,
    private authorization: Authorization) {
    this.init();
  }

  private init(): void {

    this.serverCommunicator.post(ApiPaths.GET_AUTHORIZATION, (req: any, res: any) => {
      const username = req.body.username
      const action = req.body.action // read | write | execute | authorize
      const resourceType = req.body.resourceType // executable | cluster
      const resourceName = req.body.resourceName // admin.function.base.hash_password
      const rule = action + ":" + resourceType + ":" + resourceName

      this.authorization.getAuthorization(username, rule)
      .then((authorization) => {
        res.status(200).send({isAuthorized: authorization !== undefined})
      })
    });

    this.serverCommunicator.post(ApiPaths.ADD_AUTHORIZATION, (req: any, res: any) => {
      // Check if user is allowed to add authorizations
      // add authorization
      const requestor = req.body.requestor
      const username = req.body.username
      const action = req.body.action
      const resourceType = req.body.resourceType // executable | cluster
      const resourceName = req.body.resourceName // admin.function.base.hash_password
      const rule = action + ":" + resourceType + ":" + resourceName

      this.authorization.getAuthorization(requestor, "authorize:" + resourceType + ":" + resourceName)
      .then((authorization) => {
        if (authorization !== undefined) {
          return this.authorization.addAuthorization(username, rule)
        }
      }).then(() => {
        res.status(200).send()
      })
    });
  }
}
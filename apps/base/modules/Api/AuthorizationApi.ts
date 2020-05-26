import { ServerCommunicator } from "../Communicator/ServerCommunicator";
import { ApiPaths } from "./ApiPaths";
import { Authorization } from "../Auth/Authorization";

import * as Lodash from "lodash"

export class AuthorizationApi {

  constructor(
    private serverCommunicator: ServerCommunicator,
    private authorization: Authorization) {
    this.init();
  }

  private init(): void {

    this.serverCommunicator.post(ApiPaths.ADD_AUTHORIZATION, (req: any, res: any) => {
      // Check if user is allowed to add authorizations
      // add authorization
      const resource_from = req.body.resource_from
      const resource_to = req.body.resource_to
      const visibility = req.body.visibility
      return this.authorization.addAuthorizationVisibility(resource_from, resource_to, visibility)
      .then(() => {
        res.status(200).send()
      })
    });

    this.serverCommunicator.post(ApiPaths.ADD_AUTHORIZATION_PRIVILEGE, (req: any, res: any) => {
      const resource_from = req.body.resource_from
      const resource_to = req.body.resource_to
      const privilege = req.body.privilege

      return this.authorization.addAuthorizationPrivilege(resource_from, resource_to, privilege)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.delete(ApiPaths.DELETE_AUTHORIZATION_PRIVILEGE, (req: any, res: any) => {
      const resource_from = req.query.resource_from
      const resource_to = req.query.resource_to
      const privilege = req.query.privilege

      return this.authorization.deleteAuthorizationPrivilege(resource_from, resource_to, privilege)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_AUTHORIZATION_FOR_RESOURCE, (req: any, res: any) => {
      // Check if user is allowed to add authorizations
      // add authorization
      const resource = req.query.resource
      this.authorization.getAuthorizationVisibilityForResource(resource)
      .then((visibilities: any[]) => {
        return Promise.all(Lodash.map(visibilities, (item) => {
          return this.authorization.getAllAuthorizationPrivilege(item.resource_from, item.resource_to)
          .then((privileges: any[]) => {
            return {
              resource_from: item.resource_from,
              resource_to: item.resource_to,
              visibility: item.visibility,
              privileges: Lodash.map(privileges, (privilege) => privilege.privilege)
            }
          })
        }))
      })
      .then((results) => {
        res.status(200).send(results)
      })
    });

    this.serverCommunicator.delete(ApiPaths.DELETE_AUTHORIZATION, (req: any, res: any) => {
      const resource_from = req.query.resource_from
      const resource_to = req.query.resource_to

      Promise.all([
        this.authorization.deleteAuthorizationVisibility(resource_from, resource_to),
        this.authorization.deleteAllAuthorizationPrivilege(resource_from, resource_to)
      ]).then(() => {
        res.status(200).send()
      })
    });
  }
}
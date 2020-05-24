import {
  ServerCommunicator,
  ApiPaths
} from "../modules";
import { ClientManager } from "../Client/ClientManager";

export class ClientApi {

  constructor(
    private serverCommunicator: ServerCommunicator,
    private clientManager: ClientManager
    ) {
    this.init();
  }

  private init(): void {

    // Clusters
    this.serverCommunicator.post(ApiPaths.ADD_CLUSTER, (req: any, res: any) => {
      this.clientManager.addCluster(req.body)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_CLUSTER, (req: any, res: any) => {
      this.clientManager.getCluster(req.query.username, req.query.name)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_CLUSTER_FOR_USER, (req: any, res: any) => {
      this.clientManager.getClusterForUser(req.query.username)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.delete(ApiPaths.DELETE_CLUSTER, (req: any, res: any) => {
      this.clientManager.deleteCluster(req.query.username, req.query.name)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    // Environments
    this.serverCommunicator.post(ApiPaths.ADD_ENVIRONMENT, (req: any, res: any) => {
      this.clientManager.addEnvironment(req.body)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_ENVIRONMENT, (req: any, res: any) => {
      this.clientManager.getEnvironment(req.query.username, req.query.name, req.query.cluster)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_ENVIRONMENT_FOR_USER, (req: any, res: any) => {
      this.clientManager.getEnvironmentForUser(req.query.username)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_ENVIRONMENT_FOR_CLUSTER, (req: any, res: any) => {
      this.clientManager.getEnvironmentForCluster(req.query.username, req.query.cluster)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.delete(ApiPaths.DELETE_ENVIRONMENT, (req: any, res: any) => {
      this.clientManager.deleteEnvironment(req.query.username, req.query.name, req.query.cluster)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.post(ApiPaths.BUILD_IMAGE, (req: any, res: any) => {
      this.clientManager.buildImage(req.body.username, req.body.name, req.body.cluster)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.post(ApiPaths.START_ENVIRONMENT, (req: any, res: any) => {
      this.clientManager.startEnvironment(req.body.username, req.body.name, req.body.cluster)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.post(ApiPaths.STOP_ENVIRONMENT, (req: any, res: any) => {
      this.clientManager.stopEnvironment(req.body.username, req.body.name, req.body.cluster)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    /**
     * Adds an executable to be executed on the node.
     *
     * path: /executable
     * method: POST
     * body: any
     */
    this.serverCommunicator.post(ApiPaths.ADD_EXECUTABLE, (req: any, res: any) => {
      const data = req.body;
      this.clientManager.addExecutable(data)
      .then((result: any) => {
        res.status(200).send(result);
      });
    });

    /**
     * Get an executable
     *
     * path: /executable/:username/:exe/:name
     * method: GET
     */
    this.serverCommunicator.get(ApiPaths.GET_EXECUTABLE, (req: any, res: any) => {
      const username = req.params.username;
      const exe = req.params.exe;
      const name = req.params.name;
      this.clientManager.getExecutable(username, exe, name).then((result) => {
        res.status(200).send(result);
      });
    });

    /**
     * Get all executables
     *
     * path: /executable/:username/:exe
     * method: GET
     */
    this.serverCommunicator.get(ApiPaths.GET_EXECUTABLES, (req: any, res: any) => {
      const exe = req.params.exe;
      const username = req.params.username;
      this.clientManager.getExecutables(username, exe)
      .then((results) => {
        res.status(200).send(results);
      });
    });

    /**
     * Delete executables
     *
     * path: /executable/:username/:exe/:name
     * method: DELETE
     */
    this.serverCommunicator.delete(ApiPaths.DELETE_EXECUTABLE, (req: any, res: any) => {
      const exe = req.params.exe;
      const username = req.params.username;
      const name = req.params.name;
      this.clientManager.deleteExecutable(username, exe, name)
      .then((results) => {
        res.status(200).send(results);
      });
    });

    /**
     * Search all executables
     *
     * path: /executable/search?searchText=string
     * method: GET
     */
    this.serverCommunicator.get(ApiPaths.SEARCH_EXECUTABLES, (req: any, res: any) => {
      const searchText = req.query.searchText;
      this.clientManager.searchExecutables(searchText)
      .then((results) => {
        res.status(200).send(results);
      });
    });

    /**
     * Execute an executable.
     *
     * path: /master/:username/:exe/:name/run
     * method: POST
     */
    this.serverCommunicator.post(ApiPaths.RUN_EXECUTABLE, (req: any, resp: any) => {
      const username = req.params.username;
      const name = req.params.name;
      const exe = req.params.exe;
      const data = req.body;
      const token = req.headers.token;
      this.clientManager.runExecutable(username, exe, name, data, token)
      .then((result: any) => {
        resp.status(200).send(result);
      });
    });

    this.serverCommunicator.post(ApiPaths.ADD_USER, (req: any, res: any) => {
      this.clientManager.addUser(req.body.username, req.body.email, req.body.password)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.post(ApiPaths.ADD_USER_SESSION, (req: any, res: any) => {
      this.clientManager.addUserSession(req.body.username, req.body.password)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.delete(ApiPaths.DELETE_USER_SESSION, (req: any, res: any) => {
      this.clientManager.deleteUserSession(req.query.token)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.post(ApiPaths.VALIDATE_USER_SESSION, (req: any, res: any) => {
      this.clientManager.validateUserSession(req.body.token)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.post(ApiPaths.ADD_USER_TOKEN, (req: any, res: any) => {
      this.clientManager.addUserToken(req.body.username, req.headers.sessiontoken)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_USER_TOKENS, (req: any, res: any) => {
      this.clientManager.getUserTokens(req.query.username, req.headers.sessiontoken)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.delete(ApiPaths.DELETE_USER_TOKEN, (req: any, res: any) => {
      this.clientManager.deleteUserToken(req.query.tokenId, req.headers.sessiontoken)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.post(ApiPaths.ADD_AUTHORIZATION, (req: any, res: any) => {
      const resource_from = req.body.resource_from;
      const resource_to = req.body.resource_to;
      const visibility = req.body.visibility;

      this.clientManager.addAuthorization(resource_from, resource_to, visibility)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.post(ApiPaths.ADD_AUTHORIZATION_PRIVILEGE, (req: any, res: any) => {
      const resource_from = req.body.resource_from;
      const resource_to = req.body.resource_to;
      const privilege = req.body.privilege;

      this.clientManager.addAuthorizationPrivilege(resource_from, resource_to, privilege)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.delete(ApiPaths.DELETE_AUTHORIZATION_PRIVILEGE, (req: any, res: any) => {
      const resource_from = req.query.resource_from;
      const resource_to = req.query.resource_to;
      const privilege = req.query.privilege;

      this.clientManager.deleteAuthorizationPrivilege(resource_from, resource_to, privilege)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.get(ApiPaths.GET_AUTHORIZATION_FOR_RESOURCE, (req: any, res: any) => {
      this.clientManager.getAuthorizationForResource(req.query.resource)
      .then((result) => {
        res.status(200).send(result)
      })
    })

    this.serverCommunicator.delete(ApiPaths.DELETE_AUTHORIZATION, (req: any, res: any) => {
      const resource_from = req.query.resource_from;
      const resource_to = req.query.resource_to;

      this.clientManager.deleteAuthorization(resource_from, resource_to)
      .then((result) => {
        res.status(200).send(result)
      })
    })
  }
}
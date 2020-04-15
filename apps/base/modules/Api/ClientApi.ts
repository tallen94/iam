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
  }
}
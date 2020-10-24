import { DatabaseCommunicator } from "../Communicator/DatabaseCommunicator";
import { ShellCommunicator } from "../Communicator/ShellCommunicator";
import { Queries } from "../Constants/Queries";

import * as Lodash from "lodash"
import * as uuid from "uuid"
import { Templates } from "../Constants/Templates";
import { FileSystem } from "../FileSystem/FileSystem";
import { Functions } from "../Constants/Functions";

export class SecretManager {

  constructor(
    private databaseCommunicator: DatabaseCommunicator, 
    private shellCommunicator: ShellCommunicator,
    private fileSystem: FileSystem) { }

  public addSecret(data: any) {
    return this.getSecret(data.name, data.username)
    .then((result) => {
      if (!result) {
        return this.databaseCommunicator.execute(Queries.ADD_SECRET, {
          name: data.name, 
          username: data.username,
          description: data.description
        })
      } else {
        return this.databaseCommunicator.execute(Queries.UPDATE_SECRET, {
          name: data.name, 
          username: data.username,
          description: data.description
        })
      }
    }).then(() => {
      const secretFile = this.replace(Templates.SECRET, {
        name: this.getSecretFullName(data.name, data.username),
        value: this.encodeSecret(data.value)
      })

      const fileUid = uuid.v4()
      return this.fileSystem.put("run", fileUid, secretFile)
      .then(() => {
        return this.shellCommunicator.exec(Functions.KUBECTL_APPLY, "bash", "{file}", {
          file: this.fileSystem.path("run/" + fileUid)
        })
      }).then(() => {
        return this.fileSystem.delete(this.fileSystem.path("run/" + fileUid))
      })
    })
  }

  public getSecret(name: string, username: string) {
    return this.databaseCommunicator.execute(Queries.GET_SECRET, {name: name, username: username})
    .then((results) => {
      if (results.length > 0) {
        const secret = results[0]
        return this.shellCommunicator.exec(Functions.KUBECTL_DECODE_SECRET, "bash", "{name}", {
          name: this.getSecretFullName(name, username)
        }).then((value) => {
          secret.value = value
          return secret
        })
      }
      return undefined
    })
  }

  public getSecretsForUser(username: string) {
    return this.databaseCommunicator.execute(Queries.GET_SECRETS_FOR_USER, {username: username})
  }

  public deleteSecret(name: string, username: string) {
    return this.shellCommunicator.exec(Functions.KUBECTL_DELETE_SECRET, "bash", "{name}", {
      name: this.getSecretFullName(name, username)
    })
  }

  private replace(s: string, data: any): string {
    Lodash.each(data, (value, key) => {
      const re = new RegExp("{" + key + "}", "g");
      s = s.replace(re, value);
    });
    return s;
  }

  private getSecretFullName(name: string, username: string) {
    return [username, name].join("-")
  }

  private encodeSecret(value: string) {
    const buffer = new Buffer(value)
    return buffer.toString('base64')
  }
}
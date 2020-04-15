import { DatabaseCommunicator } from "../Communicator/DatabaseCommunicator";
import { Queries } from "../Constants/Queries";
import * as UUID from "uuid";
import * as Crypto from "crypto";

export class Authentication {

  constructor(private databaseCommunicator: DatabaseCommunicator) {

  }

  public addUserPassword(username: string, password: string) {
    const passwordSalt = this.randomString(20)
    const passwordHash = this.hashNTimes(password, passwordSalt, 100)
    return this.databaseCommunicator.execute(Queries.ADD_USER_PASSWORD, {username: username, passwordHash: passwordHash, salt: passwordSalt})
    .then((result: any) => {
      return { success: result.affectedRows == 1 && result.warningCount == 0}
    })
  }

  public addUserSession(username: string, password: string): Promise<any> {
    return this.databaseCommunicator.execute(Queries.GET_USER_PASSWORD, {username: username})
    .then((result: any[]) => {
      if (result.length > 0 && this.hashNTimes(password, result[0].salt, 100) === result[0].passwordHash) {
        return this.addSessionToken(username)
      }
      return Promise.resolve({ error: "invalid credentials" })
    })
  }

  public deleteUserSession(token: string) {
    return this.databaseCommunicator.execute(Queries.DELETE_USER_SESSION, {token: token})
  }

  public validateUserSession(token: string) {
    return this.databaseCommunicator.execute(Queries.GET_USER_SESSION, {token: token})
    .then((result: any[]) => {
      if (result.length > 0) {
        return result[0]
      }
      return { error: "invalid session" }
    })
  }

  public addUserToken(username: string) {
    const tokenId = UUID.v4()
    const tokenSalt = this.randomString(20)
    const tokenSecret = this.randomString(64)
    const tokenHash = this.hashString(tokenSecret, tokenSalt)
    return this.databaseCommunicator.execute(Queries.ADD_USER_TOKEN, {
      username: username,
      tokenId: tokenId,
      tokenSalt: tokenSalt,
      tokenSecretHash: tokenHash
    }).then(() => {
      return {
        tokenId: tokenId,
        tokenSecret: tokenSecret
      }
    })
  }

  public getUserTokens(username: string) {
    return this.databaseCommunicator.execute(Queries.GET_USER_TOKENS, {username: username})
  }

  public deleteUserToken(tokenId: string) {
    return this.databaseCommunicator.execute(Queries.DELETE_USER_TOKEN, {tokenId: tokenId})
  }

  public validateUserToken(tokenId: string, tokenSecret: string) {
    return this.getUserToken(tokenId)
    .then((result: any) => {
      if (!result.error && result.tokenSecret === this.hashString(tokenSecret, result.tokenSalt)) {
        return { username: result.username }
      } 
      return { error: "invalid token" }
    })
  }

  public getUserToken(tokenId: string) {
    return this.databaseCommunicator.execute(Queries.GET_USER_TOKEN, {tokenId: tokenId})
    .then((result) => {
      if (result.length > 0) {
        return result[0]
      }
      return { error: "invalid token" }
    })
  }

  private addSessionToken(username: string) {
    const token = UUID.v4()
    return this.databaseCommunicator.execute(Queries.ADD_USER_SESSION, {username: username, token: token})
    .then((result: any) => {
      if (result.affectedRows == 1 && result.warningCount == 0) {
        return { token: token };
      }
      return { error: "failed to create session"}
    })
  } 

  private hashString(str: string, salt: string) {
    const hash = Crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(str)
    return hash.digest('hex')
  }

  private randomString(length: number) {
    return Crypto.randomBytes(Math.ceil(length/2))
      .toString('hex') /** convert to hexadecimal format */
      .slice(0,length);
  }

  private hashNTimes(str: string, salt: string, n: number) {
    let hash = str
    for (let i = 0; i < n; i++) {
      hash = this.hashString(hash, salt)
    }
    return hash;
  }
}
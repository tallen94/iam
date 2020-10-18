export class AuthData {

  constructor(
    private sessionToken: string, 
    private tokenId: string, 
    private tokenSecret: string) {

  }

  public getSessionToken() {
    return this.sessionToken
  }

  public getTokenId() {
    return this.tokenId
  }

  public getTokenSecret() {
    return this.tokenSecret
  }

  public getHeaders() {
    return { sessiontoken: this.getSessionToken(), tokenid: this.getTokenId(), tokensecret: this.getTokenSecret() }
  }

  public static fromHeaders(headers: any) {
    return new AuthData(headers.sessiontoken, headers.tokenid, headers.tokensecret)
  }
}
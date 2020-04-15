export class Queries {
  
  // Executable
  public static GET_EXE_BY_TYPE_NAME ="select * from executable where name={name} and username={username} and exe={exe}"
  public static GET_EXE_FOR_USER = "select * from executable where username={username} and exe={exe}"
  public static SEARCH_EXECUTABLES = "select * from executable where name LIKE {searchText}"
  public static ADD_EXECUTABLE = "INSERT INTO executable(username, uuid, name, data, exe, input, output, description, environment,visibility)"
                                + " VALUES ({username},{uuid},{name},{data},{exe},{input},{output},{description},{environment},{visibility})"
  public static UPDATE_EXECUTABLE = "UPDATE executable SET data={data}, input={input}, output={output}, description={description}, environment={environment}, visibility={visibility} WHERE exe={exe} AND name={name};"
  public static DELETE_EXECUTABLE = "delete from executable where username={username} and exe={exe} and name={name};"

  // Route
  public static GET_ROUTE = "select * from route where username={username} and name = {name} and exe={exe};"
  public static GET_ROUTES_FOR_USER = "select * from route where username={username} and exe={exe};"
  public static SEARCH_ROUTES = "select * from route where name like {searchText}"
  public static ADD_ROUTE = "insert into route (username, name, exe, environment) values({username},{name},{exe},{environment});"
  public static DELETE_ROUTE = "delete from route where username={username} and name={name} and exe={exe}"

  // Authorization
  public static ADD_AUTHORIZATION = "insert into authorization (username, rule) values ({username}, {rule})"
  public static GET_AUTHORIZATION = "select * from authorization where username={username} and rule={rule};"

  // Tokens
  public static ADD_USER_SESSION = "insert into user_session (username, token) values ({username}, {token});"
  public static GET_USER_SESSION = "select * from user_session where token={token};"
  public static DELETE_USER_SESSION = "delete from user_session where token={token};"

  public static ADD_USER_TOKEN = "insert into user_token (username, tokenId, tokenSecretHash, tokenSalt) values ({username}, {tokenId}, {tokenSecretHash}, {tokenSalt});"
  public static GET_USER_TOKENS = "select tokenId from user_token where username={username}"
  public static GET_USER_TOKEN = "select * from user_token where tokenId={tokenId}"
  public static DELETE_USER_TOKEN = "delete from user_token where tokenId={tokenId}"
  
  public static ADD_USER_PASSWORD = "insert into user_password (username, passwordHash, salt) values ({username}, {passwordHash}, {salt})"
  public static GET_USER_PASSWORD = "select * from user_password where username={username}"
  
  // Users
  public static ADD_USER = "insert into user (username, email) values ({username}, {email});"
  public static GET_USER = "select * from user where username={username};"
}
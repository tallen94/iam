export class ApiPaths {
  // IamManager endpoints
  public static ADD_CLIENT = "/client";
  public static GET_STATUS = "/status";

  // IamClient endpoints

  // PROCESS
  public static SPAWN_PROCESS = "/process/:exe/:name/spawn";
  public static WRITE_PROCESS = "/process/:name/write";

  // EXECUTABLE
  public static ADD_EXECUTABLE = "/executable";
  public static GET_EXECUTABLE = "/executable/:username/:exe/:name";
  public static GET_EXECUTABLES = "/executable/:username/:exe";
  public static RUN_EXECUTABLE = "/executable/:username/:exe/:name/run";
  public static DELETE_EXECUTABLE = "/executable/:username/:exe/:name"
  public static SEARCH_EXECUTABLES = "/search";

  // Authorization
  public static GET_AUTHORIZATION = "/authorization/get"
  public static ADD_AUTHORIZATION = "/authorization/add"

  // Authentication
  public static ADD_USER_PASSWORD =       "/authentication/user/password"
  
  public static ADD_USER_SESSION =        "/authentication/user/session"
  public static DELETE_USER_SESSION =     "/authentication/user/session"
  public static VALIDATE_USER_SESSION =   "/authentication/user/session/validate"

  public static ADD_USER_TOKEN =          "/authentication/user/token"
  public static GET_USER_TOKENS =         "/authentication/user/token"
  public static DELETE_USER_TOKEN =       "/authentication/user/token"
  public static VALIDATE_USER_TOKEN =     "/authentication/user/token/validate"
  
  // User
  public static ADD_USER =    "/user"
  public static GET_USER =    "/user"
}
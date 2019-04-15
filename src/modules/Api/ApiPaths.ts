export class ApiPaths {
  public static ADD_CLIENT = "/client";
  public static GET_STATUS = "/status";
  public static UPDATE = "/update";
  public static ADD_PROGRAM = "/program/:name";
  public static RUN_PROGRAM = "/program/:name/run";
  public static ADD_COMMAND = "/command/:name";
  public static RUN_COMMAND = "/command/:name/run";
  public static ADD_QUERY = "/query/:name";
  public static RUN_QUERY = "/query/:name/run";
  public static ADD_ASYNC_STEP_LIST = "/stepList/async/:name";
  public static ADD_SYNC_STEP_LIST = "/stepList/sync/:name";
  public static RUN_STEP_LIST = "/stepList/:name/run";
  public static CLEAR_CACHE = "/clearCache";
}
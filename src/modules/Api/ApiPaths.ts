export class ApiPaths {
  // IamManager endpoints
  public static ADD_CLIENT = "/client";
  public static GET_STATUS = "/status";
  public static UPDATE = "/update";
  public static CLEAR_CACHE = "/clearCache";

  // IamClient endpoints

  // EXECUTABLE
  public static ADD_EXECUTABLE = "/:type/:name";
  public static GET_EXECUTABLE = "/:type/:name";
  public static GET_EXECUTABLES = "/:type";
  public static RUN_EXECUTABLE = "/:type/:name/run";

  // PROGRAM
  public static ADD_PROGRAM = "/program/:name";
  public static GET_PROGRAM = "/program/:name";
  public static GET_PROGRAMS = "/program";
  public static RUN_PROGRAM = "/program/:name/run";

  // COMMAND
  public static ADD_COMMAND = "/command/:name";
  public static GET_COMMAND = "/command/:name";
  public static GET_COMMANDS = "/command";
  public static RUN_COMMAND = "/command/:name/run";

  // QUERY
  public static ADD_QUERY = "/query/:name";
  public static GET_QUERY = "/query/:name";
  public static GET_QUERIES = "/query";
  public static RUN_QUERY = "/query/:name/run";

  // STEP_LIST
  public static ADD_STEP_LIST = "/stepList/:name";
  public static GET_STEP_LIST = "/stepList/:name";
  public static GET_STEP_LISTS = "/stepList";
  public static RUN_STEP_LIST = "/stepList/:name/run";
}
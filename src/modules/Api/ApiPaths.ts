export class ApiPaths {
  // IamManager endpoints
  public static ADD_CLIENT = "/client";
  public static GET_STATUS = "/status";

  // IamClient endpoints

  // PROCESS
  public static SPAWN_PROCESS = "/process/:type/:name/spawn";
  public static WRITE_PROCESS = "/process/:name/write";

  // EXECUTABLE
  public static ADD_EXECUTABLE = "/executable/:type/:name";
  public static GET_EXECUTABLE = "/executable/:type/:name";
  public static GET_EXECUTABLES = "/executable/:type";
  public static SEARCH_EXECUTABLES = "/search";
  public static RUN_EXECUTABLE = "/executable/:type/:name/run";
}
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
  public static SEARCH_EXECUTABLES = "/search";
}
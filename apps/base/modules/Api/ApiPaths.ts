export class ApiPaths {
  // IamManager endpoints
  public static ADD_CLIENT = "/client";
  public static GET_STATUS = "/status";
  public static RUN_DATABASE_MIGRATIONS = "/admin/dbmigration"
  public static GET_DATABASE_MIGRATION_VERSION = "/admin/dbmigration/version"
  public static GET_BASE_IMAGE = "/image"

  // IamClient endpoints

  // PROCESS
  public static SPAWN_PROCESS = "/process/:exe/:name/spawn";
  public static WRITE_PROCESS = "/process/:name/write";

  // EXECUTABLE
  public static ADD_EXECUTABLE = "/executable";
  public static GET_EXECUTABLE = "/executable/:username/:cluster/:environment/:exe/:name";
  public static GET_EXECUTABLES = "/executable/:username/:exe";
  public static RUN_EXECUTABLE = "/executable/:username/:cluster/:environment/:exe/:name/run";
  public static DELETE_EXECUTABLE = "/executable/:username/:cluster/:environment/:exe/:name"
  public static SEARCH_EXECUTABLES = "/search";

  // Cluster
  public static ADD_CLUSTER = "/cluster"
  public static GET_CLUSTER = "/cluster"
  public static GET_CLUSTER_FOR_USER = "/cluster/user"
  public static DELETE_CLUSTER = "/cluster"

  // Environment
  public static ADD_ENVIRONMENT = "/environment"
  public static GET_ENVIRONMENT = "/environment"
  public static GET_ENVIRONMENT_FOR_USER = "/environment/user"
  public static GET_ENVIRONMENT_FOR_CLUSTER = "/environment/cluster"
  public static DELETE_ENVIRONMENT = "/environment"
  public static START_ENVIRONMENT = "/environment/start"
  public static STOP_ENVIRONMENT = "/environment/stop"
  public static GET_ENDPOINTS = "/environment/endpoints"

  // Dataset
  public static ADD_DATASET = "/dataset"
  public static GET_DATASET = "/dataset"
  public static GET_DATASET_FOR_USER = "/dataset/user"
  public static LOAD_DATASET = "/dataset/load"
  public static TRANSFORM_DATASET = "/dataset/transform"
  public static READ_DATASET = "/dataset/read"
  public static DELETE_DATASET_TAG = "/dataset"

  // Image
  public static ADD_IMAGE = "/image"
  public static GET_IMAGE = "/image"
  public static GET_IMAGE_FOR_USER = "/image/user"
  public static DELETE_IMAGE = "/image"
  public static BUILD_IMAGE = "/image/build"

  // Authorization
  public static GET_AUTHORIZATION = "/authorization"
  public static ADD_AUTHORIZATION = "/authorization"
  public static DELETE_AUTHORIZATION = "/authorization"
  public static GET_AUTHORIZATION_FOR_RESOURCE = "/authorization/resource"
  public static ADD_AUTHORIZATION_PRIVILEGE = "/authorization/privilege"
  public static DELETE_AUTHORIZATION_PRIVILEGE = "/authorization/privilege"

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

  // Job
  public static ADD_JOB = "/job"
  public static GET_JOB = "/job"
  public static GET_JOBS_FOR_USER = "/job/user"
  public static DELETE_JOB = "/job"
  public static ENABLE_JOB = "/job/enable"
  public static DISABLE_JOB = "/job/disable"

  // Secret
  public static ADD_SECRET = "/secret"
  public static GET_SECRET = "/secret"
  public static GET_SECRETS_FOR_USER = "/secret/user"
  public static DELETE_SECRET = "/secret"
}
export class Queries {
  
  // Executable
  public static GET_EXE ="select * from executable where username={username} and cluster={cluster} and environment={environment} and name={name}  and exe={exe}"
  public static GET_EXE_FOR_USER = "select * from executable where username={username} and exe={exe}"
  public static SEARCH_EXECUTABLES = "select * from executable where name LIKE {searchText}"
  public static ADD_EXECUTABLE = "INSERT INTO executable(username, uuid, name, data, exe, input, output, description, environment, cluster, visibility)"
                                + " VALUES ({username},{uuid},{name},{data},{exe},{input},{output},{description},{environment},{cluster},{visibility})"
  public static UPDATE_EXECUTABLE = "UPDATE executable SET data={data}, input={input}, output={output}, description={description}, visibility={visibility} WHERE exe={exe} AND name={name} AND username={username} AND environment={environment} AND cluster={cluster};"
  public static DELETE_EXECUTABLE = "delete from executable where username={username} and exe={exe} and name={name};"


  // Image
  public static ADD_IMAGE = "insert into image(username, name, imageRepo, imageTag, description, state) values ({username}, {name}, {imageRepo}, {imageTag}, {description}, {state})"
  public static UPDATE_IMAGE = "update image set imageRepo={imageRepo}, imageTag={imageTag}, description={description}, state={state} where username={username} and name={name}"
  public static GET_IMAGE_FOR_USER = "select * from image where username={username}"
  public static GET_IMAGE = "select * from image where username={username} and name={name}"
  public static DELETE_IMAGE = "delete from image where username={username} and name={name}"

  // Environment
  public static ADD_ENVIRONMENT = "insert into environment(name, username, description, cluster, data, state) values ({name}, {username}, {description}, {cluster}, {data}, {state});"
  public static UPDATE_ENVIRONMENT = "update environment set description={description}, data={data}, state={state} where name={name} and username={username} and cluster={cluster}"
  public static GET_ENVIRONMENT = "select * from environment where name={name} and username={username} and cluster={cluster}"
  public static GET_ENVIRONMENT_FOR_USER = "select * from environment where username={username}"
  public static GET_ENVIRONMENTS_FOR_CLUSTER = "select * from environment where cluster={cluster} and username={username}"
  public static DELETE_ENVIRONMENT = "delete from environment where name={name} and username={username} and cluster={cluster}"

  // Cluster 
  public static ADD_CLUSTER = "insert into cluster(name, username, description) values({name}, {username}, {description});"
  public static UPDATE_CLUSTER = "update cluster set description={description} where name={name} and username={username};"
  public static GET_CLUSTER = "select * from cluster where name={name} and username={username};"
  public static GET_CLUSTER_FOR_USER = "select * from cluster where username={username};"
  public static DELETE_CLUSTER = "delete from cluster where username={username} and name={name};"

  // Dataset
  public static ADD_DATASET = "insert into dataset(name, username, cluster, environment, description, executable, tag) values ({name}, {username}, {cluster}, {environment}, {description}, {executable}, {tag});"
  public static UPDATE_DATASET = "update dataset set executable={executable}, description={description}, tag={tag} where username={username} and cluster={cluster} and environment={environment} and name={name}"
  public static GET_DATASET = "select * from dataset where username={username} and cluster={cluster} and environment={environment} and name={name};"
  public static GET_DATASET_FOR_USER = "select * from dataset where username={username};"

  // Route
  public static GET_ROUTE = "select * from route where username={username} and cluster={cluster} and environment={environment} and name={name} and exe={exe};"
  public static GET_ROUTES_FOR_USER = "select * from route where username={username} and exe={exe};"
  public static SEARCH_ROUTES = "select * from route where name like {searchText}"
  public static ADD_ROUTE = "insert into route (username, cluster, environment, name, exe, route) values({username},{cluster},{environment},{name},{exe},{route});"
  public static DELETE_ROUTE = "delete from route where username={username} and cluster={cluster} and environment={environment} and name={name} and exe={exe}"

  // Authorization Visibility
  public static ADD_AUTHORIZATION_VISIBILITY = "insert into authorization_visibility (resource_from, resource_to, visibility) values ({resource_from}, {resource_to}, {visibility})"
  public static UPDATE_AUTHORIZATION_VISIBILITY = "update authorization_visibility set visibility={visibility} where resource_from={resource_from} and resource_to={resource_to};"
  public static GET_AUTHORIZATION_VISIBILITY = "select * from authorization_visibility where resource_from={resource_from} and resource_to={resource_to}"
  public static DELETE_AUTHORIZATION_VISIBILITY = "delete from authorization_visibility where resource_from={resource_from} and resource_to={resource_to}"
  public static GET_AUTHORIZATION_VISIBILITY_FOR_RESOURCE = "select * from authorization_visibility where resource_to={resource};"

  // Authorization Privileges
  public static ADD_AUTHORIZATION_PRIVILEGE = "insert into authorization_privilege (resource_from, resource_to, privilege) values ({resource_from}, {resource_to}, {privilege})"
  public static GET_AUTHORIZATION_PRIVILEGE = "select * from authorization_privilege where resource_from={resource_from} and resource_to={resource_to} and privilege={privilege}"
  public static DELETE_AUTHORIZATION_PRIVILEGE = "delete from authorization_privilege where resource_from={resource_from} and resource_to={resource_to} and privilege={privilege}"
  public static DELETE_ALL_AUTHORIZATION_PRIVILEGE = "delete from authorization_privilege where resource_from={resource_from} and resource_to={resource_to}"
  public static GET_ALL_AUTHORIZATION_PRIVILEGE = "select * from authorization_privilege where resource_from={resource_from} and resource_to={resource_to};"

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

  // Jobs
  public static ADD_JOB = "insert into job (name, username, description, enabled, schedule, jobData, executable) values ({name}, {username}, {description}, {enabled}, {schedule}, {jobData}, {executable})"
  public static UPDATE_JOB = "update job set description={description}, enabled={enabled}, schedule={schedule}, jobData={jobData}, executable={executable} where name={name} and username={username}"
  public static GET_JOB = "select * from job where name={name} and username={username}"
  public static GET_JOBS_FOR_USER = "select * from job where username={username}"
  public static DELETE_JOB = "delete from job where name={name} and username={username}"

  // Secret
  public static ADD_SECRET = "insert into secret (name, username, description) values ({name}, {username}, {description})"
  public static UPDATE_SECRET = "update secret set description={description} where name={name} and username={username}"
  public static GET_SECRET = "select * from secret where name={name} and username={username}"
  public static GET_SECRETS_FOR_USER = "select * from secret where username={username}"
  public static DELETE_SECRET = "delete from secret where name={name} and username={username}" 
}
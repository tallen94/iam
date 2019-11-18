# Secrets
Iam requires a few secrets to be added in order to work.

The values here are base64 encoded. Their default values are
- user: iam
- db_name: iam

# Database
The first app to deploy is the database.

## Env
`MYSQL_ROOT_PASSWORD`: root password for database

`MYSQL_USER`: database user

`MYSQL_PASSWORD`: database password

`MYSQL_DATABASE`: database name

Verify you can connect to the database with a mysql client using the credentials above and the host is `<kubeclusterip>:30002`

# Filesystem
The filesystem stores all the files for the functions

## Env
`HOME`: `/usr/home/iam`

`TYPE`: filesystem

`PORT`: 5000

# Executor
The executor is used to run the functions and queries

## Env
`HOME`: `/usr/home/iam`

`TYPE`; executor

`PORT`: 5000

`FS_HOST`: url for the filesystem, `iam-filesystem`

`FS_PORT`: port for the filesystem, `80`

`DB_USER`: database user

`DB_PASSWORD`: database password

`DB_HOST`: database host

`DB_NAME`: database name

# Master
Master takes requrests and distributes to the executors.

## Env
`HOME`: `/usr/home/iam`

`TYPE`: master

`PORT`: 5000

`FS_HOST`: url for the filesystem, `iam-filesystem`

`FS_PORT`: port for the filesystem, `80`

`DB_USER`: database user

`DB_PASSWORD`: database password

`DB_HOST`: database host

`DB_NAME`: database name

# Dashboard
This is the UI for Iam.

## Env
`HOME`: `/usr/home/iam`

`TYPE`: dashboard

`PORT`: 5000
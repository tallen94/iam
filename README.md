## Iam

Iam is a workflow creator. Use functions and queries to generate workflow api's.

## App Structure
There are a few different components to Iam. A master, executor, filesystem, job and dashboard

Each runs in a kubernetes pod with environment variable `$TYPE` passed to the container, along with app specific config.

Each container requires a `$HOME` directory, which is set to `/user/home/iam` and a `$SERVER_PORT` of 5000.


## Development Setup

### Docker Hub
Request access to docker hub

### Kubernetes
Iam runs on a Kubernetes cluster. Follow the [minikube](https://kubernetes.io/docs/tutorials/hello-minikube/) tutorial for local development setup.

#### Secrets
Iam requires a few secrets to be added in order to work. Add this file to `kubernetes/secrets/dbconfig.yaml`

Generate a password and base64 encode it `cat '<secure_password>' | base64`

```
## Database Creds

apiVersion: v1
kind: Secret
metadata:
  name: dbconfig
type: Opaque
data:
  user: aWFt
  db_name: aWFt
  password: <base64_password>
```

Run `kubectl apply -f kubernetes/secrets/dbconfig.yaml`

This will be used to setup the database and initialize a user.

The values here are base64 encoded. Their decoded values are
- user: iam
- db_name: iam

#### Database
The first app to deploy is the database.

Run `kubectl apply -f kubernetes/apps/database.yaml`

##### Env
`MYSQL_ROOT_PASSWORD`: root password for database

`MYSQL_USER`: database user

`MYSQL_PASSWORD`: database password

`MYSQL_DATABASE`: database name

Verify you can connect to the database with a mysql client using the credentials above and the host is `<kubeclusterip>:30002`

#### Filesystem
The filesystem stores all the files for the functions

Run `kubectl apply -f kubernetes/apps/filesystem.yaml`

##### Env
`HOME`: `/usr/home/iam`

`TYPE`: filesystem

`PORT`: 5000

#### Executor
The executor is used to run the functions and queries

Run `kubectl apply -f kubernetes/apps/executor.yaml`

##### Env
`HOME`: `/usr/home/iam`

`TYPE`; executor

`PORT`: 5000

`FS_HOST`: url for the filesystem, `iam-filesystem`

`FS_PORT`: port for the filesystem, `80`

`DB_USER`: database user

`DB_PASSWORD`: database password

`DB_HOST`: database host

`DB_NAME`: database name

#### Master
Master takes requrests and distributes to the executors.

Run `kubectl apply -f kubernetes/apps/master.yaml`

##### Env
`HOME`: `/usr/home/iam`

`TYPE`: master

`PORT`: 5000

`FS_HOST`: url for the filesystem, `iam-filesystem`

`FS_PORT`: port for the filesystem, `80`

`DB_USER`: database user

`DB_PASSWORD`: database password

`DB_HOST`: database host

`DB_NAME`: database name

#### Dashboard
This is the UI for Iam.

Run `kubectl apply -f kubernetes/apps/dashboard.yaml`

##### Env
`HOME`: `/usr/home/iam`

`TYPE`: dashboard

`PORT`: 5000

### Using the Dasbhoard
The first thing to do is create an `admin` user.

Create a user with username `admin`, email `admin` and generate a secure password.


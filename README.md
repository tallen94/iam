## Iam

Iam is a workflow creator. Use functions and queries to generate workflow api's.

## Local Setup

### Docker Hub
Request access to docker hub

### Kubernetes
Iam runs on a Kubernetes cluster. Follow the `minikube` tutorial for local development setup.

#### Kubernetes Secrets
Iam requires a few secrets to be added in order to work. Add this file to `kubernetes/secrets/dbconfig.yaml`

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
  password: <generate_base64_password>
```

Run `kubectl apply -f kubernetes/secrets/dbconfig.yaml`

This will be used to setup the database and initialize a user.

The values here are base64 encoded. Their decoded values are
- user: iam
- db_name: iam

#### Deploy Database
The first app to deploy is the database.

Run `kubectl apply -f kubernetes/apps/database.yaml`

Verify you can connect to the database with a mysql client using the credentials above and the host is `<kubeclusterip>:30002`

#### Deploy the Filesystem
The filesystem stores all the files for the functions

Run `kubectl apply -f kubernetes/apps/filesystem.yaml`

#### Deploy the Executor
The executor is used to run the functions and queries

Run `kubectl apply -f kubernetes/apps/executor.yaml`

#### Deploy the Master
Master takes requrests and distributes to the executors.

Run `kubectl apply -f kubernetes/apps/master.yaml`

#### Deploy the Dashboard
This is the UI for Iam

Run `kubectl apply -f kubernetes/apps/dashboard.yaml`

### Using the Dasbhoard
The first thing to do is create an `admin` user.

Create a user with username `admin`, email `admin` and generate a secure password.


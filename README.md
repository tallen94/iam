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

### Start from scratch
Setup your environment by executing the init.sh bash script.

`>$ ./init.sh`

Check status of cluster through `minikube dashboard`


### Using the Dasbhoard
Navigate to dashboard at `iam-local:30000`

The first thing to do is create an `admin` user.

Create a user with username `admin`, email `admin` and generate a secure password.

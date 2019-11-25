## Iam

Iam is a workflow creator. Use functions and queries to generate workflow api's.

## App Structure
There are a few different components to Iam. A master, executor, filesystem, job and dashboard

Each runs in a kubernetes pod with environment variable `$TYPE` passed to the container, along with app specific config.

Each container requires a `$HOME` directory, which is set to `/user/home/iam` and a `$SERVER_PORT` of 5000.


## Development Setup

### Docker Hub
Request access to docker hub via [email](mailto:icanplayguitar@gmail.com?Subject=IAM%20Docker%20Access&Body=Docker%20pull%20request), include your docker hub username in the email.

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

## Building
There are 4 images with release cycles:
- dependencies
  - base
    - filesystem
    - dashboard

To make changes to an image create a branch that contains the `<image_name>` in the branch.

Eg. `git checkout -b base-new-feature`

This will open a PR and will run the build for that image. Get these changes approved and merge.

### Releasing Changes
To release the image you just built, create a pull request from `master` to `release/<image_name>`. This will run the build for that image. Get approval and merge.

Merging this PR will trigger a build of the docker files and all images dependent on the image being built. A new PR will be created to `master` from `deploy/<image_name>-<git_sha>` that will contain the necessary version updates for the new images to be deployed. Get this approved and merge.

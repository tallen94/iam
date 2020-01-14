# Iam

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

*Note: you must enable `hairpin mode` on the cluster. To enable in minikube run `./hairpin.sh`

### Start from scratch
Setup your environment by executing the init.sh bash script.

`>$ ./init.sh`

Check status of cluster through `minikube dashboard`

### Using the Dasbhoard
Navigate to dashboard at `<cluster_host>:30000`

The first thing to do is create an `admin` user.

Create a user with username `admin`, email `admin` and generate a secure password.

## Images
There are 5 images that can be built:
- dependencies
- base
- filesystem
- dashboard
- environment-builder

### Building Locally
There is a build script to build apps locally to deploy to `minikube`

`bash build.sh <image_name> <tag> <push>`
- `<image_name>`: dependencies | base | filesystem | dashbaord | environment-builder | database
- `<tag>`: anystring
- `<push>`: "push" or "no-push" to push docker image to docker hub

Eeach image has its own build script located at `builders/build-<image_name>`. When these scripts are run, they execute the build scripts of images dependent on the current one. 

Run `kubernetes/update.sh` to update kubernetes. In order for the apps to update, kubernetes requires a change to its yaml config. If you build with the same images name as currently deployed, run `kubernetes/delete.sh` before updating.

### Image Release Cycles
To make changes to an image create a branch and push to `origin/<branch_name>`.

Eg. `git checkout -b <branch_name>`

This will open a PR and will run the build for that image. Get these changes approved and merge.

#### Releasing Changes
To release the image you just built, create a pull request from `master` to `release/<image_name>`. This will run the build for that image. Get approval and merge.

Merging this PR will trigger a build of the docker files and all images dependent on the image being built. A new PR will be created to `master` from `deploy/<image_name>-<git_sha>` that will contain the necessary version updates for the new images to be deployed. Get this approved and merge.

# System
What it does:
- Automates building of environments into services
- Create executables that can run in the environments
- Edit code in the browser
- Dependency chain visualization
- Search
- Auto Complete



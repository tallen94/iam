## Development Setup
### Docker Hub
Request access to docker hub via [email](mailto:coldassteveniceberg@gmail.com?Subject=IAM%20Docker%20Access&Body=Docker%20pull%20request), include your docker hub username in the email.

### Kubernetes
Iam runs on a Kubernetes cluster. Follow the [minikube](https://kubernetes.io/docs/tutorials/hello-minikube/) tutorial for local development setup.

*Note: you must enable `hairpin mode` on the cluster. To enable in minikube run `./hairpin.sh`*

### Install Build Deps
Building the project requires `nodejs v[8-11]`. Ensure your system has this installed by running `node -v`

### Build Base

*Note: To build images locally without pushing to docker hub, you need to run `eval $(minikube docker-env)` to use the minikube VM's docker daemon.*

Build the application to run on minikube. (see `Building Locally` for details)

`>$ ./build.sh base minikube no minikube`

This builds the images with minikube version and will not push to docker hub.

### Start from scratch
Deploy the application by executing the init.sh bash script.

`>$ ./init.sh`

Check status of cluster through `minikube dashboard`

### Start the Proxy
The application will be running on `<minikube_ip>:30000`, but the dashboard expects the backend to be at the current browser host on port 80. 
Starting the proxy will allow us to access the application at `http://localhost`.

`>$ ./proxy.sh <minikube_ip> 30000`

### Using the Dasbhoard
Navigate to dashboard at `http://localhost`

Create a user with username, email and generate a secure password.

## Images
There are 5 images that can be built:
- dependencies
- base
- filesystem
- dashboard
- builder

### Building Locally
There is a build script to build apps locally to deploy to `minikube`

`bash build.sh <image_name> <tag> <push>`
- `<image_name>`: dependencies | base | filesystem | dashbaord | builder | database
- `<tag>`: anystring
- `<push>`: "push" or "no-push" to push docker image to docker hub
- `<provider>`: minikube | eks

Eeach image has its own build script located at `builders/build-<image_name>`. When these scripts are run, they execute the build scripts of images dependent on the current one. 

Run `kubernetes/update.sh` to update kubernetes. In order for the apps to update, kubernetes requires a change to its yaml config. If you build with the same images name as currently deployed, run `kubernetes/delete.sh` before updating.

### Image Release Cycles
To make changes to an image create a branch and push to `origin/<branch_name>`.

Eg. `git checkout -b <branch_name>`

This will open a PR and will run the build for that image. Get these changes approved and merge.

#### Releasing Changes
To release the image you just built, create a pull request from `master` to `release/<image_name>`. This will run the build for that image. Get approval and merge.

Merging this PR will trigger a build of the docker files and all images dependent on the image being built. A new PR will be created to `master` from `deploy/<image_name>-<git_sha>` that will contain the necessary version updates for the new images to be deployed. Get this approved and merge.

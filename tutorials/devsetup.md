# Development Setup
## Docker Hub
Request access to docker hub via [email](mailto:coldassteveniceberg@gmail.com?Subject=IAM%20Docker%20Access&Body=Docker%20pull%20request), include your docker hub username in the email.

## Dependencies
- Iam runs on a Kubernetes cluster, and uses [minikube](https://kubernetes.io/docs/tutorials/hello-minikube/) as a local test cluster.
- Uses [Opctl](https://opctl.io/docs/setup/bare-metal) for build, local development and deployment.

## Building
`>$ opctl run -a version="minikube" build`

This builds IAM with a **version** named `minikube`.

## Running With Opctl

`>$ opctl run -a version="minikube" dev`

## Running With Minikube
Follow the [minikube](https://kubernetes.io/docs/tutorials/hello-minikube/) tutorial for local development setup.

Check status of cluster through `minikube dashboard`

### Hairpin Mode
You must enable `hairpin mode` on the cluster. To enable in minikube run `./hairpin.sh`

### Start the Proxy
The application will be running on `<minikube_ip>:30000`, but the dashboard expects the backend to be at the current browser host on port 80. 
Starting the proxy will allow us to access the application at `http://localhost`.

`>$ ./proxy.sh`

### Deploy Manifests
To generate the kubernetes deploy manifests run:

 `>$ opctl run -a version="minikube" -a provider="minikube" deploy`

Deploy the application by executing the init.sh bash script.

`>$ ./init.sh`

Navigate to dashboard at `http://localhost`

Create a user with username, email and generate a secure password.

### Updating IAM Versions
You can change versions of software while the cluster is up and running. To change versions:
```
>$ opctl run -a version="<iam_version" -a provider="minikube" deploy
>$ ./kubernetes/update.sh minikube
```

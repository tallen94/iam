# AWS EKS

EKS is an AWS hosted, autoscaling, Kubernetes cluster.

This goes over the setup for running IAM on an EKS cluster.

## Folder
All of the code to setup the cluster is in the `eks/` folder.

## AWS account
You will need an AWS account with credentials configured, and a user that can create CloudWatch stacks and manage IAM permissions.

### Create permissions for AWS user
run `./aws-user.sh` to create a role with all permissions necessary to spin up the cluster.

### Create the Cluster
run `./cluster.sh <cluster_name> <vpc_ip_cidr> <subnet1_cidr> <subnet2_cidr>` to create the cluster.

### Resources
Setting up the cluster creates several resources.
- `IAM:Eks-Role` role for the eks cluster
- `IAM:NodeGroup-Role` role for the eks nodes
- `IAM:EKSAdmin-Role` role for managing the eks cluster
- `VPC:<vpc_ip_cidr>` vpc for the cluster
- `Subnet1:us-west-2a:<subnet1_cidr>`, `Subnet2:us-west-2b:<subnet2_cidr>`
- `EC2:EksBastion` EC2 instance for managing the eks cluster from
- `EKS:Cluster:<cluster_name>` Eks cluster
- `EKS:NodeGroup:ng-1` t3.medium size nodes


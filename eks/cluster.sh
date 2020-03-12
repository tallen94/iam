#!/bin/bash

CMD=$1
CLUSTER_NAME=$2
CLUSTER_FILE=$3

aws cloudformation $CMD-stack --profile IAMAdmin --stack-name $CLUSTER_NAME --capabilities CAPABILITY_NAMED_IAM --template-body file:///home/treovor/git/iam/eks/$CLUSTER_FILE.yaml
# aws cloudformation validate-template  --template-body file:///home/treovor/git/iam/eks/cluster.yaml
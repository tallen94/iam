#!/bin/bash

aws cloudformation update-stack --stack-name iam-cluster --capabilities CAPABILITY_NAMED_IAM --template-body file:///home/treovor/git/iam/eks/cluster.yaml
# aws cloudformation validate-template  --template-body file:///home/treovor/git/iam/eks/cluster.yaml
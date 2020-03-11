#!/bin/bash

CMD=$1
aws cloudformation $CMD-stack --stack-name iam-admin-role --capabilities CAPABILITY_NAMED_IAM --template-body file:///home/treovor/git/iam/eks/aws-user.yaml

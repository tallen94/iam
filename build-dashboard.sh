#!/bin/bash

# Set Tag
TAG="icanplayguitar94/iam:dashboard-$1"

# Build dashboard project
ENV=$2
bash public/build.sh $ENV

# Build and push docker container
docker build --no-cache -t $TAG images/dashboard
docker push $TAG

# Generate kubernetes app file
bash kubernetes/templates/dashboard.sh $TAG
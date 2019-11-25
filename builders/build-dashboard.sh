#!/bin/bash

# Set Tag
TAG="icanplayguitar94/iam:dashboard-$1"
PUSH=$2

# Build dashboard project
ENV=$3
bash public/build.sh $ENV

# Build and push docker container
docker build --no-cache -t $TAG images/dashboard

if [ "$PUSH" = "push" ]; then
  echo "Pushing Docker TAG: $TAG"
  docker push $TAG
fi

# Generate kubernetes app file
bash kubernetes/templates/dashboard.sh $TAG
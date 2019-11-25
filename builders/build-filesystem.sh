#!/bin/bash

# Set Tag
TAG="icanplayguitar94/iam:filesystem-$1"
PUSH=$2

# Build docker container and push
docker build --no-cache -t $TAG images/filesystem

if [ "$PUSH" = "push" ]; then
  echo "Pushing Docker TAG: $TAG"
  docker push $TAG
fi

# Create kubernetes apps
bash kubernetes/templates/filesystem.sh $TAG
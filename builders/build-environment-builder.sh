#!/bin/bash

# Set Tag
TAG="icanplayguitar94/iam:environment-builder-$1"
PUSH=$2

# Build docker container and push
docker build --no-cache -t $TAG images/environment-builder

if [ "$PUSH" = "push" ]; then
  echo "Pushing Docker TAG: $TAG"
  docker push $TAG
fi

# Create kubernetes apps
bash kubernetes/templates/environment-builder.sh $TAG
#!/bin/bash

# Set Tag
TAG="icanplayguitar94/iam:dependencies-$1"
PUSH=$2

# Build docker container and push
docker build --no-cache -t $TAG images/dependencies

if [ "$PUSH" = "push" ]; then
  echo "Pushing Docker TAG: $TAG"
  docker push $TAG
fi

# Update downstreams
bash images/templates/base.sh $TAG
bash build-base.sh $1
#!/bin/bash

# Set Tag
TAG="icanplayguitar94/iam:secret-$1"
PUSH=$2
PROVIDER=$3

# Build docker container and push
docker build --no-cache -t $TAG images/secret

if [ "$PUSH" = "push" ]; then
  echo "Pushing Docker TAG: $TAG"
  docker push $TAG
fi

# Create kubernetes apps
bash kubernetes/templates/secret.sh $TAG $PROVIDER
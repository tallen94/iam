#!/bin/bash

# Set Tag
TAG="icanplayguitar94/iam:database-$1"
PUSH=$2
PROVIDER=$3

# Build docker container and push
docker build --no-cache -t $TAG images/database

if [ "$PUSH" = "push" ]; then
  echo "Pushing Docker TAG: $TAG"
  docker push $TAG
fi

# Create kubernetes apps
bash kubernetes/templates/database.sh $TAG $PROVIDER
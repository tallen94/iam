#!/bin/bash

# Set Tag
TAG="icanplayguitar94/iam:client-$1"
PUSH=$2
PROVIDER=$3

# Build client project
ENV=$4
rm -rf images/client/src
bash apps/dashboard/build.sh $ENV  && cp -r apps/dashboard/dist images/client/src

# Build and push docker container
docker build --no-cache -t $TAG images/client

if [ "$PUSH" = "push" ]; then
  echo "Pushing Docker TAG: $TAG"
  docker push $TAG
fi

# Generate kubernetes app file
bash kubernetes/templates/client.sh $TAG $PROVIDER
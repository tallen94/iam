#!/bin/bash

# Set Tag
TAG="icanplayguitar94/iam:router-$1"
PUSH=$2

# Build router project
ENV=$3
rm -rf images/router/src
bash apps/dashboard/build.sh $ENV  && cp -r apps/dashboard/dist images/router/src

# Build and push docker container
docker build --no-cache -t $TAG images/router

if [ "$PUSH" = "push" ]; then
  echo "Pushing Docker TAG: $TAG"
  docker push $TAG
fi

# Generate kubernetes app file
bash kubernetes/templates/router.sh $TAG
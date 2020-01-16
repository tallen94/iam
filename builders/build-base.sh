#!/bin/bash

# Set Tag
VERSION=$1
TAG="icanplayguitar94/iam:base-$VERSION"
PUSH=$2

# Build base app
bash apps/base/build.sh && mv apps/base/deploy-1.0.0.tgz images/base/deploy.tgz

# Build docker container and push
docker build --no-cache -t $TAG images/base

if [ "$PUSH" = "push" ]; then
  echo "Pushing Docker TAG: $TAG"
  docker push $TAG
fi

# Create kubernetes apps
bash kubernetes/templates/base.sh $TAG
bash kubernetes/templates/job.sh $TAG

# Update downstreams
bash images/templates/filesystem.sh $TAG
bash builders/build-filesystem.sh $VERSION $PUSH

bash images/templates/router.sh $TAG
bash builders/build-router.sh $VERSION $PUSH -prod

bash images/templates/environment-builder.sh $TAG
bash builders/build-environment-builder.sh $VERSION $PUSH
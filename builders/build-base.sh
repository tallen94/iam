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
bash kubernetes/templates/executor.sh $TAG
bash kubernetes/templates/master.sh $TAG
bash kubernetes/templates/job.sh $TAG

# Update downstreams
bash images/templates/filesystem.sh $TAG
bash builders/build-filesystem.sh $VERSION $PUSH

bash images/templates/dashboard.sh $TAG
bash builders/build-dashboard.sh $VERSION $PUSH -prod
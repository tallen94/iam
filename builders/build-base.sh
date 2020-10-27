#!/bin/bash

# Set Tag
VERSION=$1
TAG="icanplayguitar94/iam:base-$VERSION"
PUSH=$2
PROVIDER=$3

# Build base app
bash apps/base/build.sh && mv apps/base/deploy-1.0.0.tgz images/base/deploy.tgz

# Build docker container and push
docker build --no-cache -t $TAG images/base

if [ "$PUSH" = "push" ]; then
  echo "Pushing Docker TAG: $TAG"
  docker push $TAG
fi

# Create kubernetes apps
bash kubernetes/templates/filesystem.sh $TAG $PROVIDER
bash kubernetes/templates/auth.sh $TAG $PROVIDER
bash kubernetes/templates/router.sh $TAG $PROVIDER
bash kubernetes/templates/user.sh $TAG $PROVIDER
bash kubernetes/templates/admin.sh $TAG $PROVIDER

bash images/templates/client.sh $TAG
bash builders/build-client.sh $VERSION $PUSH $PROVIDER -prod

bash images/templates/builder.sh $TAG
bash builders/build-builder.sh $VERSION $PUSH $PROVIDER

bash images/templates/job.sh $TAG
bash builders/build-job.sh $VERSION $PUSH $PROVIDER

bash images/templates/secret.sh $TAG
bash builders/build-secret.sh $VERSION $PUSH $PROVIDER
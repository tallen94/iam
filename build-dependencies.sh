#!/bin/bash

# Set Tag
TAG="icanplayguitar94/iam:dependencies-$1"

# Build docker container and push
docker build --no-cache -t $TAG images/dependencies
docker push $TAG

# Update downstreams
bash images/templates/bash.sh $TAG
bash build-base.sh $1
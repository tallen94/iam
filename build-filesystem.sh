#!/bin/bash

# Set Tag
TAG="icanplayguitar94/iam:filesystem-$1"

# Build docker container and push
docker build --no-cache -t $TAG images/filesystem
docker push $TAG

# Create kubernetes apps
bash kubernetes/templates/filesystem.sh $TAG
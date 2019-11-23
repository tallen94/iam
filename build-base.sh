#!/bin/bash

# Set Tag
TAG="icanplayguitar94/iam:base-$1"

# Build base app
bash src/build.sh

# Build docker container and push
docker build --no-cache -t $TAG images/base
docker push $TAG

# Create kubernetes apps
bash kubernetes/templates/executor.sh $TAG
bash kubernetes/templates/master.sh $TAG
bash kubernetes/templates/job.sh $TAG

# Update downstreams
bash images/templates/filesystem.sh $TAG
bash build-filesystem.sh $1

bash images/templates/dashboard.sh $TAG
bash build-dashboard.sh $1
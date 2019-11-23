#!/bin/bash

# Set Tag
TAG="icanplayguitar94/iam:database-$1"

# Build docker container and push
docker build --no-cache -t $TAG images/database
docker push $TAG

# Create kubernetes apps
bash kubernetes/templates/database.sh $TAG
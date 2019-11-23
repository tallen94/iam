#!/bin/bash

# Set Tag
TAG="icanplayguitar94/iam:dashboard-$1"

# Build dashboard project
ENV=$2
npm install --prefix public && npm run --prefix public build$ENV && cp -r public/dist images/dashboard/src

# Build and push docker container
docker build --no-cache -t $TAG images/dashboard
docker push $TAG

# Generate kubernetes app file
bash kubernetes/templates/dashboard.sh $TAG
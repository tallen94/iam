#!/bin/bash

# Set Tag
TAG="icanplayguitar94/iam:filesystem-$1"
PUSH=$2

curl -d '{"filesystem":"iam-filesystem"}' -H "Content-Type: application/json" \
  -s -X POST iam-local:30005/executable/admin/function/backup-filesystem/run
aws s3 cp --recursive s3://iam-filesystem/ ./images/filesystem/

# Build docker container and push
docker build --no-cache -t $TAG images/filesystem

if [ "$PUSH" = "push" ]; then
  echo "Pushing Docker TAG: $TAG"
  docker push $TAG
fi

# Create kubernetes apps
bash kubernetes/templates/filesystem.sh $TAG
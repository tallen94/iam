#!/bin/sh

docker run \
  --rm \
  -p 5000:5000 \
  -e HOME=/usr/home/iam \
  -e TYPE=dashboard \
  -it iam
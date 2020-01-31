#!/bin/bash

docker build --no-cache -t iam-nginx images/nginx --build-arg host=$1 --build-arg port=$2
docker run -p 80:80 -d iam-nginx

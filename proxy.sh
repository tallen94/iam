#!/bin/bash

HOST=$(minikube ip)
PORT=30000

docker build --no-cache -t iam-nginx images/nginx --build-arg host=$HOST --build-arg port=$PORT
docker run -p 80:80 -d iam-nginx

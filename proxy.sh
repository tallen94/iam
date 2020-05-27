#!/bin/bash

docker build --no-cache -t iam-nginx images/nginx --build-arg host=192.168.64.10 --build-arg port=30000
docker run -p 80:80 -d iam-nginx

#!/bin/bash

TAG="icanplayguitar94/iam:dependencies-$1"

docker build --no-cache -t $TAG images/dependencies

cat > kubernetes/base/Dockerfile <<EOF
FROM $TAG

WORKDIR /usr/home/iam

COPY deploy.tgz deploy.tgz
RUN npm i -g deploy.tgz

EXPOSE 5000

CMD deploy
EOF
./build-base $1
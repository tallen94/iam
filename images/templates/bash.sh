#!/bin/bash
TAG=$1

cat > images/base/Dockerfile <<EOF
FROM $TAG
WORKDIR /usr/home/iam
COPY deploy.tgz deploy.tgz
RUN npm i -g deploy.tgz
EXPOSE 5000
CMD deploy
EOF
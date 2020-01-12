#!/bin/bash
TAG=$1

cat > images/environment-builder/Dockerfile <<EOF
FROM $TAG

RUN apt-get update
RUN apt-get install docker.io -y

RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/\`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt\`/bin/linux/amd64/kubectl
RUN chmod +x ./kubectl
RUN mv ./kubectl /usr/local/bin/kubectl
EOF
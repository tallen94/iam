#!/bin/bash
TAG=$1

cat > images/job/Dockerfile <<EOF
FROM $TAG

RUN apt-get update

RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/\`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt\`/bin/linux/amd64/kubectl
RUN chmod +x ./kubectl
RUN mv ./kubectl /usr/local/bin/kubectl
EOF
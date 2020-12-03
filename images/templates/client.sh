#!/bin/bash
TAG=$1

cat > images/client/Dockerfile <<EOF
FROM $TAG
COPY ./src public/dist

ENV BASE_IMAGE="$TAG"

EOF
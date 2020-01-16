#!/bin/bash
TAG=$1

cat > images/router/Dockerfile <<EOF
FROM $TAG
COPY ./src public/dist
EOF
#!/bin/bash
TAG=$1

cat > images/dashboard/Dockerfile <<EOF
FROM $TAG
COPY ./src public/dist
EOF
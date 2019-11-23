#!/bin/bash
TAG=$1

cat > images/filesystem/Dockerfile <<EOF
FROM $TAG
ADD programs /usr/home/iam/programs
EOF
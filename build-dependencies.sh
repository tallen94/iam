#!/bin/bash

TAG="icanplayguitar94/iam:dependencies-$1"

docker build --no-cache -t $TAG images/dependencies

#!/bin/bash

APP_NAME=$1
VERSION=$2
PUSH=$3

if [ $APP_NAME = "base" ]; then
  PROVIDER=$4
  bash builders/build-$APP_NAME.sh $VERSION $PUSH $PROVIDER
elif [ $APP_NAME = "router" ]; then
  PROVIDER=$4
  ENV=$5
  bash builders/build-$APP_NAME.sh $VERSION $PUSH $PROVIDER $ENV
elif [ $APP_NAME = "database" ]; then 
  bash builders/build-$APP_NAME.sh $VERSION $PUSH
elif [ $APP_NAME = "dependencies" ]; then
  bash builders/build-$APP_NAME.sh $VERSION $PUSH
elif [ $APP_NAME = "filesystem" ]; then
  bash builders/build-$APP_NAME.sh $VERSION $PUSH
else
  echo "Invalid app"
fi
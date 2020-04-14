#!/bin/bash

USER=$1
HOST=$2
PORT=$3

cat database/init | mysql -u $USER -p -h $HOST -P $PORT -D iam

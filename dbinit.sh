#!/bin/bash

USER=$1
HOST=$2
PORT=$3

cat /home/treovor/git/filesystem/admin/queries/init | mysql -u $USER -p -h $HOST -P $PORT -D iam

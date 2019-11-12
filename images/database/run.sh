#!/bin/bash

docker run -d -p 3306:3306 --name mysqldatabase \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_USER=iam \
  -e MYSQL_PASSWORD=password \
  -e MYSQL_DATABASE=iam
  iam/mysqldatabase:0.0.1
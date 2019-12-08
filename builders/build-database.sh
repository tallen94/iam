#!/bin/bash

# Set Tag
TAG="icanplayguitar94/iam:database-$1"
PUSH=$2

mysqldump -u iam -p -h iam-local -P 30002 --databases iam > images/database/database.sql

cat >> images/database/database.sql <<EOF
-- Create Users
CREATE USER '\$MYSQL_USER'@'%' IDENTIFIED BY '\$MYSQL_PASSWORD';
GRANT SELECT ON \`\$MYSQL_DATABASE\`.* TO '\$MYSQL_USER'@'%';
GRANT UPDATE ON \`\$MYSQL_DATABASE\`.* TO '\$MYSQL_USER'@'%';
GRANT DELETE ON \`\$MYSQL_DATABASE\`.* TO '\$MYSQL_USER'@'%';
GRANT INSERT ON \`\$MYSQL_DATABASE\`.* TO '\$MYSQL_USER'@'%';
EOF

# Build docker container and push
docker build --no-cache -t $TAG images/database

if [ "$PUSH" = "push" ]; then
  echo "Pushing Docker TAG: $TAG"
  docker push $TAG
fi

# Create kubernetes apps
bash kubernetes/templates/database.sh $TAG
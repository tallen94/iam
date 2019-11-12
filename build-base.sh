#!/bin/sh
npm run build
npm pack
mv deploy-1.0.0.tgz images/base/deploy.tgz

cd images && ./bake.sh base $1

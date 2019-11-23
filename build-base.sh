#!/bin/bash
npm install --prefix src && npm run --prefix src build && npm run --prefix src pkg && mv src/deploy-1.0.0.tgz images/base/deploy.tgz

cd images && ./bake.sh base $GITHUB_SHA

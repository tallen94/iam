#!/bin/bash

npm install --prefix public && npm run --prefix public build-prod && cp -r public/dist images/dashboard/src

cd images && ./bake.sh dashboard $1
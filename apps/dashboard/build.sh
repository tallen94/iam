#!/bin/bash
ENV=$1

rm -rf /src/images/client/src
npm install && npm run build$ENV
mv dist /src/images/client/src
#!/bin/bash
ENV=$1

npm install && npm run build$ENV
mv dist /src/images/client/src
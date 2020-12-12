#!/bin/bash

npm install && npm run build && npm run pkg
mv deploy-1.0.0.tgz /src/images/base/deploy.tgz

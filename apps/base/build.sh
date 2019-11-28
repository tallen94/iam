#!/bin/bash

npm install --prefix apps/base \
&& npm run --prefix apps/base build \
&& npm run --prefix apps/base pkg

#!/bin/bash
ENV=$1
npm install --prefix public && npm run --prefix public build$ENV && cp -r public/dist images/dashboard/src

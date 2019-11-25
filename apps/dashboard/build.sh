#!/bin/bash
ENV=$1
npm install --prefix apps/dashboard && npm run --prefix apps/dashboard build$ENV

#!/bin/sh

cd public 
npm run build
cd ..
rm -r images/dashboard/src
cp -r public/dist images/dashboard/src

cd images
./bake.sh dashboard $1
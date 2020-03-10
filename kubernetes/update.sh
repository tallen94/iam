#!/bin/sh

PROVIDER=$1

# System apps
kubectl apply -f kubernetes/apps/$PROVIDER/router.yaml
kubectl apply -f kubernetes/apps/$PROVIDER/filesystem.yaml

# Environments
kubectl apply -f kubernetes/apps/$PROVIDER/base.yaml
kubectl apply -f kubernetes/apps/$PROVIDER/environment-builder.yaml

# Database
kubectl apply -f kubernetes/apps/$PROVIDER/database.yaml
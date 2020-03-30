#!/bin/sh

PROVIDER=$1
NAMESPACE=$2

# System apps
kubectl apply -f kubernetes/apps/$PROVIDER/router.yaml --namespace=$NAMESPACE
kubectl apply -f kubernetes/apps/$PROVIDER/filesystem.yaml --namespace=$NAMESPACE

# Environments
kubectl apply -f kubernetes/apps/$PROVIDER/base.yaml --namespace=$NAMESPACE
kubectl apply -f kubernetes/apps/$PROVIDER/environment-builder.yaml --namespace=$NAMESPACE

# Database
kubectl apply -f kubernetes/apps/$PROVIDER/database.yaml --namespace=$NAMESPACE
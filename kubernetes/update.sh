#!/bin/sh

PROVIDER=$1
NAMESPACE=$2

## Default Namespace
kubectl apply -f kubernetes/apps/$PROVIDER/client.yaml 
kubectl apply -f kubernetes/apps/$PROVIDER/router.yaml
kubectl apply -f kubernetes/apps/$PROVIDER/auth.yaml
kubectl apply -f kubernetes/apps/$PROVIDER/user.yaml
kubectl apply -f kubernetes/apps/$PROVIDER/database.yaml

## Namespaced
kubectl apply -f kubernetes/apps/$PROVIDER/filesystem.yaml --namespace=$NAMESPACE
kubectl apply -f kubernetes/apps/$PROVIDER/base.yaml --namespace=$NAMESPACE
kubectl apply -f kubernetes/apps/$PROVIDER/environment-builder.yaml --namespace=$NAMESPACE
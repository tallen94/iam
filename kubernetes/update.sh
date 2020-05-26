#!/bin/sh

PROVIDER=$1

## Default Namespace
kubectl apply -f kubernetes/apps/$PROVIDER/client.yaml 
kubectl apply -f kubernetes/apps/$PROVIDER/router.yaml
kubectl apply -f kubernetes/apps/$PROVIDER/auth.yaml
kubectl apply -f kubernetes/apps/$PROVIDER/user.yaml
kubectl apply -f kubernetes/apps/$PROVIDER/database.yaml
kubectl apply -f kubernetes/apps/$PROVIDER/filesystem.yaml
kubectl apply -f kubernetes/apps/$PROVIDER/builder.yaml
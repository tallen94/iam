#!/bin/sh

kubectl apply -f kubernetes/apps/dashboard.yaml
kubectl apply -f kubernetes/apps/router.yaml
kubectl apply -f kubernetes/apps/executor.yaml
kubectl apply -f kubernetes/apps/filesystem.yaml
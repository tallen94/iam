#!/bin/sh

# System apps
kubectl apply -f kubernetes/apps/dashboard.yaml
kubectl apply -f kubernetes/apps/router.yaml
kubectl apply -f kubernetes/apps/filesystem.yaml

# Environments
kubectl apply -f kubernetes/apps/base.yaml
kubectl apply -f kubernetes/apps/environment-builder.yaml
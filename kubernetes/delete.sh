#!/bin/bash

NAMESPACE=$1

# System apps
kubectl delete deployment iam-router --namespace=$NAMESPACE
kubectl delete service iam-router --namespace=$NAMESPACE
kubectl delete deployment iam-filesystem --namespace=$NAMESPACE
kubectl delete service iam-filesystem --namespace=$NAMESPACE

# Environments
kubectl delete deployment base --namespace=$NAMESPACE
kubectl delete service base --namespace=$NAMESPACE
kubectl delete deployment environment-builder --namespace=$NAMESPACE
kubectl delete service environment-builder --namespace=$NAMESPACE

# Database
# kubectl delete pod mysqldatabase --namespace=$NAMESPACE
# kubectl delete service mysqldatabase --namespace=$NAMESPACE

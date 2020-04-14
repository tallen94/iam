#!/bin/bash

NAMESPACE=$1

# System apps
kubectl delete deployment client
kubectl delete service client
kubectl delete deployment router 
kubectl delete service router 
kubectl delete deployment auth 
kubectl delete service auth
kubectl delete deployment user
kubectl delete service user

# Environments
kubectl delete deployment base --namespace=$NAMESPACE
kubectl delete service base --namespace=$NAMESPACE
kubectl delete deployment environment-builder --namespace=$NAMESPACE
kubectl delete service environment-builder --namespace=$NAMESPACE
kubectl delete deployment filesystem --namespace=$NAMESPACE
kubectl delete service filesystem --namespace=$NAMESPACE

# Database
# kubectl delete pod mysqldatabase --namespace=$NAMESPACE
# kubectl delete service mysqldatabase --namespace=$NAMESPACE

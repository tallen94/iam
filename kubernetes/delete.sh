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
kubectl delete deployment filesystem
kubectl delete service filesystem
kubectl delete deployment builder
kubectl delete service builder
kubectl delete deployment job
kubectl delete service job
kubectl delete deployment secret
kubectl delete service secret
kubectl delete deployment admin
kubectl delete service admin

# Database
# kubectl delete pod mysqldatabase --namespace=$NAMESPACE
# kubectl delete service mysqldatabase --namespace=$NAMESPACE

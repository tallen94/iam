#! /bin/bash

NAMESPACE=$1

## DEFAULT NAMESPACE APPS
echo Deleting kube client setup..
kubectl delete deployment client
kubectl delete service client

echo Deleting kube router setup..
kubectl delete deployment router
kubectl delete service router

echo Deleting kube auth setup..
kubectl delete deployment auth
kubectl delete service auth

echo Deleting kube user setup..
kubectl delete deployment user
kubectl delete service user

echo Deleting kube database setup...
kubectl delete pod mysqldatabase
kubectl delete service mysqldatabase

## NAMESPACED APPS
echo Deleting kube filesystem setup..
kubectl delete deployment filesystem
kubectl delete service filesystem

echo Deleting kube builder
kubectl delete deployment builder
kubectl delete service builder

echo Deleting kube secrets...
kubectl delete secret regcred
kubectl delete secret dbconfig
kubectl delete secret dockerconfig
kubectl delete secret clustertoken

echo Deleting kube service accounts
kubectl delete serviceaccount builder-service-account
kubectl delete clusterrole builder-cluster-role
kubectl delete clusterrolebinding builder-cluster-role-binding
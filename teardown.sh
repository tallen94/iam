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

kubectl delete secret regcred
kubectl delete secret dbconfig

## NAMESPACED APPS
echo Deleting kube filesystem setup..
kubectl delete deployment filesystem --namespace=$NAMESPACE
kubectl delete service filesystem --namespace=$NAMESPACE

echo Deleting kube base..
kubectl delete deployment base --namespace=$NAMESPACE
kubectl delete service base --namespace=$NAMESPACE

echo Deleting kube builder
kubectl delete deployment builder --namespace=$NAMESPACE
kubectl delete service builder --namespace=$NAMESPACE

echo Deleting kube secrets...
kubectl delete secret regcred --namespace=$NAMESPACE
kubectl delete secret dbconfig --namespace=$NAMESPACE
kubectl delete secret dockerconfig --namespace=$NAMESPACE
kubectl delete secret clustertoken --namespace=$NAMESPACE

echo Deleting kube service accounts
kubectl delete serviceaccount admin-service-account --namespace=$NAMESPACE
kubectl delete clusterrole admin-cluster-role --namespace=$NAMESPACE
kubectl delete clusterrolebinding admin-cluster-role-binding --namespace=$NAMESPACE
#! /bin/bash

NAMESPACE=$1

echo Deleting kube database setup...
kubectl delete pod mysqldatabase --namespace=$NAMESPACE
kubectl delete service mysqldatabase --namespace=$NAMESPACE

echo Deleting kube filesystem setup..
kubectl delete deployment iam-filesystem --namespace=$NAMESPACE
kubectl delete service iam-filesystem --namespace=$NAMESPACE

echo Deleting kube iam-router setup..
kubectl delete deployment iam-router --namespace=$NAMESPACE
kubectl delete service iam-router --namespace=$NAMESPACE

echo Deleting kube base..
kubectl delete deployment base --namespace=$NAMESPACE
kubectl delete service base --namespace=$NAMESPACE

echo Deleting kube environment-builder
kubectl delete deployment environment-builder --namespace=$NAMESPACE
kubectl delete service environment-builder --namespace=$NAMESPACE

echo Deleting kube secrets...
kubectl delete secret regcred --namespace=$NAMESPACE
kubectl delete secret dbconfig --namespace=$NAMESPACE
kubectl delete secret dockerconfig --namespace=$NAMESPACE

echo Deleting kube service accounts
kubectl delete serviceaccount admin-service-account --namespace=$NAMESPACE
kubectl delete clusterrole admin-cluster-role --namespace=$NAMESPACE
kubectl delete clusterrolebinding admin-cluster-role-binding --namespace=$NAMESPACE
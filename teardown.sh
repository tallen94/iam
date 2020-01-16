#! /bin/bash

echo Deleting kube database setup...
kubectl delete pod mysqldatabase
kubectl delete service mysqldatabase

echo Deleting kube filesystem setup..
kubectl delete deployment iam-filesystem
kubectl delete service iam-filesystem

echo Deleting kube iam-router setup..
kubectl delete deployment iam-router
kubectl delete service iam-router

echo Deleting kube base..
kubectl delete deployment base
kubectl delete service base

echo Deleting kube environment-builder
kubectl delete deployment environment-builder
kubectl delete service environment-builder

echo Deleting kube secrets...
kubectl delete secret regcred
kubectl delete secret dbconfig
kubectl delete secret dockerconfig

echo Deleting kube service accounts
kubectl delete serviceaccount api-service-account 
kubectl delete clusterrole api-access
kubectl delete clusterrolebinding api-access
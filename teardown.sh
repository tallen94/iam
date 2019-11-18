#! /bin/bash

echo Deleting kube dashboard...
kubectl delete deployment iam-dashboard
kubectl delete service iam-dashboard
echo Deleting kube database setup...
kubectl delete pod mysqldatabase
kubectl delete service mysqldatabase
echo Deleting kube executor..
kubectl delete deployment iam-executor
kubectl delete service iam-executor
echo Deleting kube filesystem setup..
kubectl delete deployment iam-filesystem
kubectl delete service iam-filesystem
echo Deleting kube master setup..
kubectl delete deployment iam-master
kubectl delete service iam-master
echo Deleting kube secrets...
kubectl delete secret regcred
kubectl delete secret dbconfig
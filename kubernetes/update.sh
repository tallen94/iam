#!/bin/sh

kubectl apply -f kubernetes/apps/dashboard.yaml
kubectl apply -f kubernetes/apps/executor.yaml
kubectl apply -f kubernetes/apps/filesystem.yaml
kubectl apply -f kubernetes/apps/job.yaml
kubectl apply -f kubernetes/apps/master.yaml
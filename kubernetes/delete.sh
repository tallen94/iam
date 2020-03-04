#!/bin/bash

# System apps
kubectl delete deployment iam-router
kubectl delete service iam-router
kubectl delete deployment iam-filesystem
kubectl delete service iam-filesystem

# Environments
kubectl delete deployment base
kubectl delete service base
kubectl delete deployment environment-builder
kubectl delete service environment-builder

# Database
kubectl delete pod mysqldatabase
kubectl delete service mysqldatabase
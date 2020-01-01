#!/bin/bash

# System apps
kubectl delete deployment iam-router
kubectl delete deployment iam-dashboard
kubectl delete deployment iam-filesystem

# Environments
kubectl delete deployment base
kubectl delete deployment environment-builder
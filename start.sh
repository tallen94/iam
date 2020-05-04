#!/bin/bash

minikube start
./hairpin.sh
./fsinit.sh
./dbinit.sh iam iam-local 30002
./proxy.sh
minikube dashboard

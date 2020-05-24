#!/bin/bash

minikube start
./hairpin.sh
./fsinit.sh
./proxy.sh
minikube dashboard

#!/bin/bash

minikube start
./hairpin.sh
./proxy.sh
minikube dashboard

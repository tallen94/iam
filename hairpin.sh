#!/bin/sh

minikube ssh -- sudo ip link set docker0 promisc on

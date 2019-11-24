#!/bin/bash
TAG=$1

cat > kubernetes/apps/filesystem.yaml <<EOF
apiVersion: apps/v1 # for versions before 1.9.0 use apps/v1beta2
kind: Deployment
metadata:
  name: iam-filesystem
spec:
  selector:
    matchLabels:
      app: iam-filesystem
  replicas: 1 # tells deployment to run 2 pods matching the template
  template:
    metadata:
      labels:
        app: iam-filesystem
    spec:
      imagePullSecrets:
      - name: regcred
      containers:
      - name: iam-filesystem
        image: $TAG
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 5000
        readinessProbe:
          httpGet:
            path: /status
            port: 5000
          initialDelaySeconds: 3
          periodSeconds: 3
        env:
        - name: HOME
          value: "/usr/home/iam"
        - name: TYPE 
          value: "filesystem"
        - name: SERVER_PORT
          value: "5000"

---
apiVersion: v1
kind: Service
metadata:
  name: iam-filesystem
spec:
  selector:
    app: iam-filesystem
  ports:
    - protocol: TCP
      port: 80
      targetPort: 5000
EOF
#!/bin/bash
TAG=$1

cat > kubernetes/apps/executor.yaml <<EOF
apiVersion: apps/v1 # for versions before 1.9.0 use apps/v1beta2
kind: Deployment
metadata:
  name: iam-executor
spec:
  selector:
    matchLabels:
      app: iam-executor
  replicas: 1 # tells deployment to run 2 pods matching the template
  template:
    metadata:
      labels:
        app: iam-executor
    spec:
      imagePullSecrets:
      - name: regcred
      containers:
      - name: iam-executor
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
          value: "executor"
        - name: SERVER_PORT
          value: "5000"

        # FS CONFIG
        - name: FS_HOST
          value: "iam-filesystem"
        - name: FS_PORT
          value: "80"

        ## DB CONFIG
        - name: DB_USER
          valueFrom:
            secretKeyRef:
              name: dbconfig
              key: user
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: dbconfig
              key: password
        - name: DB_HOST
          value: "mysqldatabase.default"
        - name: DB_NAME
          valueFrom:
            secretKeyRef:
              name: dbconfig
              key: db_name
---
apiVersion: v1
kind: Service
metadata:
  name: iam-executor
spec:
  selector:
    app: iam-executor
  ports:
    - protocol: TCP
      port: 80
      targetPort: 5000
EOF
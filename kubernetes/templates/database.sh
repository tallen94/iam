#!/bin/bash
TAG=$1

cat > kubernetes/apps/database.yaml <<EOF
apiVersion: v1 # for versions before 1.9.0 use apps/v1beta2
kind: Pod
metadata:
  name: mysqldatabase
  labels:
    app: mysqldatabase
spec:
  imagePullSecrets:
  - name: regcred
  containers:
  - name: mysqldatabase
    image: $TAG
    imagePullPolicy: IfNotPresent
    ports:
    - containerPort: 3306
    env:
      - name: MYSQL_ROOT_PASSWORD
        value: 'password'
      ## DB CONFIG
      - name: MYSQL_USER
        valueFrom:
          secretKeyRef:
            name: dbconfig
            key: user
      - name: MYSQL_PASSWORD
        valueFrom:
          secretKeyRef:
            name: dbconfig
            key: password
      - name: MYSQL_DATABASE
        valueFrom:
          secretKeyRef:
            name: dbconfig
            key: db_name

---
apiVersion: v1
kind: Service
metadata:
  name: mysqldatabase
spec:
  selector:
    app: mysqldatabase
  type: NodePort
  ports:
    - protocol: TCP
      port: 3306
      targetPort: 3306
      nodePort: 30002
EOF
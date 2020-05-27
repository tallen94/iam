#!/bin/bash
TAG=$1
PROVIDER=$2
touch kubernetes/apps/$PROVIDER/database.yaml

if [ $PROVIDER = "minikube" ] 
then
cat > kubernetes/apps/minikube/database.yaml <<EOF
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
fi

if [ $PROVIDER = "eks" ] 
then
cat > kubernetes/apps/eks/database.yaml <<EOF
apiVersion: v1 # for versions before 1.9.0 use apps/v1beta2
kind: Pod
metadata:
  name: mysqldatabase
  labels:
    app: mysqldatabase
spec:
  imagePullSecrets:
  - name: regcred
  nodeSelector:
    type: ng-1
  containers:
  - name: mysqldatabase
    image: $TAG
    imagePullPolicy: IfNotPresent
    ports:
    - containerPort: 3306
    
    resources:
      requests:
        memory: "2000Mi"
        cpu: "1000m"
      limits:
        memory: "2000Mi"
        cpu: "1000m"

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
    
      
    volumeMounts:
    - mountPath: /var/lib/mysql
      name: ebs-volume
      
  volumes:
  - name: ebs-volume
    awsElasticBlockStore:
      volumeID: vol-0e7cd4ae9de4d64a2
      fsType: ext4

---
apiVersion: v1
kind: Service
metadata:
  name: mysqldatabase
spec:
  selector:
    app: mysqldatabase
  type: LoadBalancer
  ports:
    - protocol: TCP
      port: 3306
      targetPort: 3306
EOF
fi

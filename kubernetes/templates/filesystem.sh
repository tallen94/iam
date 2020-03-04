#!/bin/bash
TAG=$1
PROVIDER=$2

if [ $PROVIDER = "minikube" ] 
then
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
          value: "executor"
        - name: SERVER_PORT
          value: "5000"

        # FS CONFIG
        - name: FS_HOST
          value: "iam-filesystem"
        - name: FS_PORT
          value: "80"

        ## DB CONFIG
        - name: DB_HOST
          value: "mysqldatabase.default"
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
        - name: DB_NAME
          valueFrom:
            secretKeyRef:
              name: dbconfig
              key: db_name
        
        volumeMounts:
            - name: iamhome
              mountPath: "/usr/home/iam"
      volumes:
      - name: iamhome
        hostPath:
          path: /home/docker/iam

---
apiVersion: v1
kind: Service
metadata:
  name: iam-filesystem
spec:
  selector:
    app: iam-filesystem
  type: NodePort
  ports:
    - protocol: TCP
      port: 80
      targetPort: 5000
      nodePort: 30003
EOF
fi 

if [ $PROVIDER = "eks" ] 
then
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
      nodeSelector:
        type: basic
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
        
        resources:
          requests:
            memory: "500Mi"
            cpu: "250m"
          limits:
            memory: "500Mi"
            cpu: "250m"

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
        - name: DB_HOST
          value: "mysqldatabase.default"
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
        - name: DB_NAME
          valueFrom:
            secretKeyRef:
              name: dbconfig
              key: db_name
        
        volumeMounts:
        - mountPath: /usr/home/iam
          name: ebs-volume
          
      volumes:
      - name: ebs-volume
        awsElasticBlockStore:
          volumeID: vol-026ba890557281748
          fsType: ext4

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
fi
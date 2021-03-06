#!/bin/bash
TAG=$1
PROVIDER=$2
touch kubernetes/apps/$PROVIDER/secret.yaml

if [ $PROVIDER = "minikube" ] 
then
cat > kubernetes/apps/minikube/secret.yaml <<EOF
apiVersion: apps/v1 # for versions before 1.9.0 use apps/v1beta2
kind: Deployment
metadata:
  name: secret
spec:
  selector:
    matchLabels:
      app: secret
  replicas: 1 # tells deployment to run 2 pods matching the template
  template:
    metadata:
      labels:
        app: secret
    spec:
      serviceAccountName: secret-service-account
      imagePullSecrets:
      - name: regcred
      containers:
      - name: secret
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
          value: "secret"
        - name: SERVER_PORT
          value: "5000"
        - name: "ENVIRONMENT"
          value: "base"

        # FS CONFIG
        - name: FS_HOST
          value: "filesystem.default"
        - name: FS_PORT
          value: "80"

        # AUTH CONFIG
        - name: AUTH_HOST
          value: auth.default
        - name: AUTH_PORT
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
---
apiVersion: v1
kind: Service
metadata:
  name: secret
spec:
  selector:
    app: secret
  ports:
    - protocol: TCP
      port: 80
      targetPort: 5000
EOF
fi 

if [ $PROVIDER = "eks" ] 
then
cat > kubernetes/apps/eks/secret.yaml <<EOF
apiVersion: apps/v1 # for versions before 1.9.0 use apps/v1beta2
kind: Deployment
metadata:
  name: secret
spec:
  selector:
    matchLabels:
      app: secret
  replicas: 1 # tells deployment to run 2 pods matching the template
  template:
    metadata:
      labels:
        app: secret
    spec:
      serviceAccountName: secret-service-account
      imagePullSecrets:
      - name: regcred
      nodeSelector:
        type: ng-1
      containers:
      - name: secret
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
          value: "secret"
        - name: SERVER_PORT
          value: "5000"
        - name: "ENVIRONMENT"
          value: "base"

        # FS CONFIG
        - name: FS_HOST
          value: "filesystem"
        - name: FS_PORT
          value: "80"

        # AUTH CONFIG
        - name: AUTH_HOST
          value: auth.default
        - name: AUTH_PORT
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
---
apiVersion: v1
kind: Service
metadata:
  name: secret
spec:
  selector:
    app: secret
  ports:
    - protocol: TCP
      port: 80
      targetPort: 5000
EOF
fi

if [ $PROVIDER = "ocean" ] 
then
cat > kubernetes/apps/ocean/secret.yaml <<EOF
apiVersion: apps/v1 # for versions before 1.9.0 use apps/v1beta2
kind: Deployment
metadata:
  name: secret
spec:
  selector:
    matchLabels:
      app: secret
  replicas: 1 # tells deployment to run 2 pods matching the template
  template:
    metadata:
      labels:
        app: secret
    spec:
      serviceAccountName: secret-service-account
      imagePullSecrets:
      - name: regcred
      containers:
      - name: secret
        image: icanplayguitar94/iam:secret-dcdf74373f53a78981d22dcc3af8a15a203e5665
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
          value: "secret"
        - name: SERVER_PORT
          value: "5000"
        - name: "ENVIRONMENT"
          value: "base"

        # FS CONFIG
        - name: FS_HOST
          value: "filesystem"
        - name: FS_PORT
          value: "80"

        # AUTH CONFIG
        - name: AUTH_HOST
          value: auth.default
        - name: AUTH_PORT
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
---
apiVersion: v1
kind: Service
metadata:
  name: secret
spec:
  selector:
    app: secret
  ports:
    - protocol: TCP
      port: 80
      targetPort: 5000
EOF
fi
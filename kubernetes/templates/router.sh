#!/bin/bash
TAG=$1
PROVIDER=$2
touch kubernetes/apps/$PROVIDER/router.yaml

if [ $PROVIDER = "minikube" ] 
then
cat > kubernetes/apps/minikube/router.yaml <<EOF
apiVersion: apps/v1 # for versions before 1.9.0 use apps/v1beta2
kind: Deployment
metadata:
  name: router
spec:
  selector:
    matchLabels:
      app: router
  replicas: 1 # tells deployment to run 2 pods matching the template
  template:
    metadata:
      labels:
        app: router
    spec:
      imagePullSecrets:
      - name: regcred
      containers:
      - name: router
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
          value: "router"
        - name: SERVER_PORT
          value: "5000"

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
          
        # BUILDER CONFIG
        - name: BUILDER_HOST
          value: "builder.default"
        - name: BUILDER_PORT
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
  name: router
spec:
  selector:
    app: router
  ports:
    - protocol: TCP
      port: 80
      targetPort: 5000
EOF
fi 

if [ $PROVIDER = "eks" ] 
then
cat > kubernetes/apps/eks/router.yaml <<EOF
apiVersion: apps/v1 # for versions before 1.9.0 use apps/v1beta2
kind: Deployment
metadata:
  name: router
spec:
  selector:
    matchLabels:
      app: router
  replicas: 1 # tells deployment to run 2 pods matching the template
  template:
    metadata:
      labels:
        app: router
    spec:
      imagePullSecrets:
      - name: regcred
      nodeSelector:
        type: ng-1
      containers:
      - name: router
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
          value: "router"
        - name: SERVER_PORT
          value: "5000"

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
          
        # BUILDER CONFIG
        - name: BUILDER_HOST
          value: "builder.default"
        - name: BUILDER_PORT
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
  name: router
spec:
  selector:
    app: router
  ports:
    - protocol: TCP
      port: 80
      targetPort: 5000
EOF
fi

if [ $PROVIDER = "ocean" ] 
then
cat > kubernetes/apps/ocean/router.yaml <<EOF
apiVersion: apps/v1 # for versions before 1.9.0 use apps/v1beta2
kind: Deployment
metadata:
  name: router
spec:
  selector:
    matchLabels:
      app: router
  replicas: 1 # tells deployment to run 2 pods matching the template
  template:
    metadata:
      labels:
        app: router
    spec:
      imagePullSecrets:
      - name: regcred
      containers:
      - name: router
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
          value: "router"
        - name: SERVER_PORT
          value: "5000"

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
          
        # BUILDER CONFIG
        - name: BUILDER_HOST
          value: "builder.default"
        - name: BUILDER_PORT
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
  name: router
spec:
  selector:
    app: router
  ports:
    - protocol: TCP
      port: 80
      targetPort: 5000
EOF
fi
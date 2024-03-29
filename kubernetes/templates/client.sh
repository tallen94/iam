#!/bin/bash
TAG=$1
PROVIDER=$2
touch kubernetes/apps/$PROVIDER/client.yaml

if [ $PROVIDER = "minikube" ] 
then
cat > kubernetes/apps/minikube/client.yaml <<EOF
apiVersion: apps/v1 # for versions before 1.9.0 use apps/v1beta2
kind: Deployment
metadata:
  name: client
spec:
  selector:
    matchLabels:
      app: client
  replicas: 1 # tells deployment to run 2 pods matching the template
  template:
    metadata:
      labels:
        app: client
    spec:
      imagePullSecrets:
      - name: regcred
      containers:
      - name: client
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
          value: "client"
        - name: SERVER_PORT
          value: "5000"

        - name: ROUTER_HOST
          value: "router.default"
        - name: ROUTER_PORT
          value: "80"
        
        - name: USER_HOST
          value: "user.default"
        - name: USER_PORT
          value: "80"
        
        - name: AUTH_HOST
          value: "auth.default"
        - name: AUTH_PORT
          value: "80"

        - name: BUILDER_HOST
          value: "builder.default"
        - name: BUILDER_PORT
          value: "80"

        - name: JOB_HOST
          value: "job.default"
        - name: JOB_PORT
          value: "80"

        - name: SECRET_HOST
          value: "secret.default"
        - name: SECRET_PORT
          value: "80"

        - name: ADMIN_HOST
          value: "admin.default"
        - name: ADMIN_PORT
          value: "80"
---
apiVersion: v1
kind: Service
metadata:
  name: client
spec:
  selector:
    app: client
  type: NodePort
  ports:
    - protocol: TCP
      port: 80
      targetPort: 5000
      nodePort: 30000
EOF
fi 

if [ $PROVIDER = "eks" ] 
then
cat > kubernetes/apps/eks/client.yaml <<EOF
apiVersion: apps/v1 # for versions before 1.9.0 use apps/v1beta2
kind: Deployment
metadata:
  name: client
spec:
  selector:
    matchLabels:
      app: client
  replicas: 1 # tells deployment to run 2 pods matching the template
  template:
    metadata:
      labels:
        app: client
    spec:
      imagePullSecrets:
      - name: regcred
      nodeSelector:
        type: ng-1
      containers:
      - name: client
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
          value: "client"
        - name: SERVER_PORT
          value: "5000"

        - name: ROUTER_HOST
          value: "router.default"
        - name: ROUTER_PORT
          value: "80"
        
        - name: USER_HOST
          value: "user.default"
        - name: USER_PORT
          value: "80"
        
        - name: AUTH_HOST
          value: "auth.default"
        - name: AUTH_PORT
          value: "80"

        - name: BUILDER_HOST
          value: "builder.default"
        - name: BUILDER_PORT
          value: "80"

        - name: JOB_HOST
          value: "job.default"
        - name: JOB_PORT
          value: "80"

        - name: SECRET_HOST
          value: "secret.default"
        - name: SECRET_PORT
          value: "80"

        - name: ADMIN_HOST
          value: "admin.default"
        - name: ADMIN_PORT
          value: "80"

---
apiVersion: v1
kind: Service
metadata:
  name: client
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-connection-idle-timeout: "4000"
spec:
  selector:
    app: client
  type: LoadBalancer
  ports:
    - protocol: TCP
      port: 80
      targetPort: 5000
EOF
fi

if [ $PROVIDER = "ocean" ] 
then
cat > kubernetes/apps/ocean/client.yaml <<EOF
apiVersion: apps/v1 # for versions before 1.9.0 use apps/v1beta2
kind: Deployment
metadata:
  name: client
spec:
  selector:
    matchLabels:
      app: client
  replicas: 1 # tells deployment to run 2 pods matching the template
  template:
    metadata:
      labels:
        app: client
    spec:
      imagePullSecrets:
      - name: regcred
      containers:
      - name: client
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
          value: "client"
        - name: SERVER_PORT
          value: "5000"

        - name: ROUTER_HOST
          value: "router.default"
        - name: ROUTER_PORT
          value: "80"
        
        - name: USER_HOST
          value: "user.default"
        - name: USER_PORT
          value: "80"
        
        - name: AUTH_HOST
          value: "auth.default"
        - name: AUTH_PORT
          value: "80"

        - name: BUILDER_HOST
          value: "builder.default"
        - name: BUILDER_PORT
          value: "80"

        - name: JOB_HOST
          value: "job.default"
        - name: JOB_PORT
          value: "80"

        - name: SECRET_HOST
          value: "secret.default"
        - name: SECRET_PORT
          value: "80"

        - name: ADMIN_HOST
          value: "admin.default"
        - name: ADMIN_PORT
          value: "80"

---
apiVersion: v1
kind: Service
metadata:
  name: client
  annotations:
    service.beta.kubernetes.io/do-loadbalancer-protocol: "http"
    service.beta.kubernetes.io/do-loadbalancer-algorithm: "round_robin"
    service.beta.kubernetes.io/do-loadbalancer-tls-ports: "443"
    service.beta.kubernetes.io/do-loadbalancer-certificate-id: "ac74a54c-01ca-449e-88cf-eb535b946669"
    service.beta.kubernetes.io/do-loadbalancer-redirect-http-to-https: "true"
spec:
  selector:
    app: client
  type: LoadBalancer
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 5000
    - name: https
      protocol: TCP
      port: 443
      targetPort: 5000
EOF
fi
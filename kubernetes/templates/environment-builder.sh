#!/bin/bash
TAG=$1

cat > kubernetes/apps/environment-builder.yaml <<EOF
apiVersion: apps/v1 # for versions before 1.9.0 use apps/v1beta2
kind: Deployment
metadata:
  name: environment-builder
spec:
  selector:
    matchLabels:
      app: environment-builder
  replicas: 1 # tells deployment to run 2 pods matching the template
  template:
    metadata:
      labels:
        app: environment-builder
    spec:
      serviceAccountName: api-service-account
      imagePullSecrets:
      - name: regcred
      nodeSelector:
        type: basic
      containers:
      - name: environment-builder
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
        - name: "ENVIRONMENT"
          value: "environment-builder"

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
              
        # DOCKER_CONFIG
        - name: DOCKER_USERNAME
          valueFrom:
            secretKeyRef:
              name: dockerconfig
              key: user
        - name: DOCKER_PASSWORD
          valueFrom:
            secretKeyRef:
              name: dockerconfig
              key: password
        - name: DOCKER_HOST
          value: tcp://localhost:2375
      
      - name: dind
        image: docker:18.05-dind
        resources:
          requests:
            memory: "1000Mi"
            cpu: "500m"
          limits:
            memory: "1000Mi"
            cpu: "500m"
        securityContext:
          privileged: true
        volumeMounts:
          - name: dind-storage
            mountPath: /var/lib/docker
        
      volumes:
        - name: dind-storage
          emptyDir: {}
---
apiVersion: v1
kind: Service
metadata:
  name: environment-builder
spec:
  selector:
    app: environment-builder
  ports:
    - protocol: TCP
      port: 80
      targetPort: 5000
EOF
export class Templates {

  public static NONE = ""

  public static EXECUTOR_TEMPLATE = `
apiVersion: apps/v1 # for versions before 1.9.0 use apps/v1beta2
kind: Deployment
metadata:
  name: {username}-{cluster}-{name}
spec:
  selector:
    matchLabels:
      app: {username}-{cluster}-{name}
  replicas: {replicas} # tells deployment to run 2 pods matching the template
  template:
    metadata:
      labels:
        app: {username}-{cluster}-{name}
    spec:
      imagePullSecrets:
      - name: regcred
      containers:
      - name: {username}-{cluster}-{name}
        image: {imageTag}
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
            memory: "{memory}"
            cpu: "{cpu}"
          limits:
            memory: "{memory}"
            cpu: "{cpu}"

        env:
        - name: HOME
          value: "/usr/home/iam"
        - name: TYPE 
          value: "executor"
        - name: SERVER_PORT
          value: "5000"
        - name: "ENVIRONMENT"
          value: "{name}"
          
      {storage}
---
{service}
  `

  public static SERVICE = `
apiVersion: v1
kind: Service
metadata:
  name: {username}-{cluster}-{name}
spec:
  selector:
    app: {username}-{cluster}-{name}
  ports:
    - protocol: TCP
      port: 80
      targetPort: {applicationPort}
  `

  public static NODEPORT_SERVICE = `
apiVersion: v1
kind: Service
metadata:
  name: {username}-{cluster}-{name}
spec:
  selector:
    app: {username}-{cluster}-{name}
  type: NodePort
  ports:
    - protocol: TCP
      port: 80
      targetPort: {applicationPort}
      nodePort: {nodePort}
  `

  public static LOADBALANCER_SERVICE = `
apiVersion: v1
kind: Service
metadata:
  name: {username}-{cluster}-{name}
spec:
  selector:
    app: {username}-{cluster}-{name}
  type: LoadBalancer
  ports:
    - protocol: TCP
      port: 80
      targetPort: {applicationPort}
  `

  public static LOCAL_VOLUME = `
        volumeMounts:
        - name: mount
          mountPath: {mountPath}
      volumes:
      - name: mount
        hostPath:
          path: {hostPath}
`
  public static ELB_VOLUME = `
        volumeMounts:
        - mountPath: {mountPath}
          name: ebs-volume
          
      volumes:
      - name: ebs-volume
        awsElasticBlockStore:
          volumeID: {volumeId}
          fsType: {fsType}
  `

  public static DATABASE = `
apiVersion: v1 # for versions before 1.9.0 use apps/v1beta2
kind: Pod
metadata:
  name: {name}
  labels:
    app: {name}
spec:
  imagePullSecrets:
  - name: regcred
  nodeSelector:
    type: basic
  containers:
  - name: {name}
    image: {imageRepo}:{name}
    imagePullPolicy: IfNotPresent
    ports:
    - containerPort: 3306
        
    resources:
      requests:
        memory: "{memory}"
        cpu: "{cpu}"
      limits:
        memory: "{memory}"
        cpu: "{cpu}"

    env:
    - name: MYSQL_ROOT_PASSWORD
      valueFrom:
        secretKeyRef:
          name: {name}dbmasterpw
          key: secret
    ## DB CONFIG
    - name: MYSQL_USER
      valueFrom:
        secretKeyRef:
          name: {name}dbuser
          key: secret
    - name: MYSQL_PASSWORD
      valueFrom:
        secretKeyRef:
          name: {name}dbpassword
          key: secret
    - name: MYSQL_DATABASE
      valueFrom:
        secretKeyRef:
          name: {name}dbname
          key: secret
        
    volumeMounts:
    - mountPath: /var/lib/mysql
      name: ebs-volume
      
  volumes:
  - name: ebs-volume
    awsElasticBlockStore:
      volumeID: {ebsVolumeId}
      fsType: ext4

---
apiVersion: v1
kind: Service
metadata:
  name: {name}
spec:
  selector:
    app: {name}
  ports:
    - protocol: TCP
      port: 3306
      targetPort: 3306

  `

  public static JOB = `
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: {name}
spec:
  schedule: {schedule}
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: {name}
            image: buildpack-deps:curl
            args:
            - /bin/sh
            - -ec
            - | 
              curl -H 'Content-type: application/json' -d '{data}' -X POST http://iam-router.default/executable/{exeUser}/{exeType}/{exeName}/run
          restartPolicy: Never
  `
}
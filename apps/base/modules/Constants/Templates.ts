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
        
        # AUTH CONFIG
        - name: AUTH_HOST
          value: auth.default
        - name: AUTH_PORT
          value: "80"
        
        # SECRET CONFIG
        - name: SECRET_HOST
          value: secret.default
        - name: SECRET_PORT
          value: "80"

        # ROUTER CONFIG
        - name: ROUTER_HOST
          value: router.default
        - name: ROUTER_PORT
          value: "80"

        {environmentVariables}
          
      {storage}
---
{service}
  `

  public static EXECUTOR_SERVICE = `
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

  public static DATABASE_SERVICE = `
apiVersion: v1
kind: Service
metadata:
  name: {username}-{cluster}-{name}
spec:
  selector:
    app: {username}-{cluster}-{name}
  ports:
    - protocol: TCP
      port: 3306
      targetPort: 3306
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

  public static OCEAN_VOLUME = `
    volumeMounts:
      - name: {username}-{cluster}-{name}-claim
        mountPath: {mountPath}
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
name: {username}-{cluster}-{name}-claim
spec:
storageClassName: "do-block-storage"
accessModes:
- ReadWriteOnce
resources:
requests:
  storage: 20Gi
  `

  public static DATABASE_TEMPLATE = `
apiVersion: v1 # for versions before 1.9.0 use apps/v1beta2
kind: Pod
metadata:
  name: {username}-{cluster}-{name}
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
    - containerPort: 3306
        
    resources:
      requests:
        memory: "{memory}"
        cpu: "{cpu}"
      limits:
        memory: "{memory}"
        cpu: "{cpu}"

    env:
    {environmentVariables}
        
{storage}
---
{service}

  `

  public static JOB = `
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: {name}
spec:
  schedule: "{schedule}"
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
              curl -H 'Content-type: application/json' -d '{data}' -X POST http://router/executable/{exeUser}/{exeCluster}/{exeEnvironment}/{exeType}/{exeName}/run
          restartPolicy: Never
  `

  public static SECRET = `
apiVersion: v1
kind: Secret
metadata:
  name: {name}
type: Opaque
data:
  value: {value}
  `

  public static DATABASE_PLAINTEXT_VARIABLE = `
    - name: {name}
      value: {value}
  `

  public static DATABASE_SECRET_VARIABLE = `
    - name: {name}
      valueFrom:
        secretKeyRef:
          name: {value}
          key: value
  `
  public static EXECUTOR_PLAINTEXT_VARIABLE = `
        - name: {name}
          value: {value}
`

  public static EXECUTOR_SECRET_VARIABLE = `
        - name: {name}
          valueFrom:
            secretKeyRef:
              name: {value}
              key: value
`
}
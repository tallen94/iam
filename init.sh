#! /bin/bash

readPassword() {
   stty -echo
   printf "Password: "
   read PASSWORD
   printf "\n"
   printf "Root Password: "
   read ROOT_PASSWORD
   stty echo
   printf "\n"
}

setupPassword() {
   INCR=0
   readPassword
   PASSWORD=$(echo -ne "$PASSWORD" | base64)
   ROOT_PASSWORD=$(echo -ne "$ROOT_PASSWORD" | base64)
}

applyConfig() {
   echo [...Initializing config...]
   kubectl apply -f kubernetes/secrets/dbconfig.yaml
   kubectl apply -f kubernetes/secrets/dockerconfig.yaml
   kubectl apply -f kubernetes/secrets/admintoken.yaml
   
   kubectl apply -f kubernetes/serviceaccounts/builder.yaml
   kubectl apply -f kubernetes/serviceaccounts/job.yaml
   kubectl apply -f kubernetes/serviceaccounts/secret.yaml
   echo [...Init...]
   ./kubernetes/update.sh $PROVIDER
   echo IAM is ready to use.
}

readDockerCreds() {
   echo Enter Docker credentials...
   printf "Username: "
   read DOCKER_USERNAME
   stty -echo
   printf "Password: "
   read DOCKER_PASSWORD
   printf "\n"
   stty echo
   printf "Email: "
   read DOCKER_EMAIL
}

loginDocker() {
   readDockerCreds
   kubectl create secret docker-registry regcred \
   --docker-server=https://index.docker.io/v1/ \
   --docker-username="$DOCKER_USERNAME" \
   --docker-password="$DOCKER_PASSWORD" \
   --docker-email="$DOCKER_EMAIL"
   echo "$DOCKER_PASSWORD" | docker login -u $DOCKER_USERNAME --password-stdin
   if [ "$?" = "1" ]; then exit 1 
   fi
}

# Main
loginDocker

echo Configure your IAM by creating a password for the database
setupPassword

mkdir -p kubernetes/secrets/

touch kubernetes/secrets/dbconfig.yaml
cat > kubernetes/secrets/dbconfig.yaml <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: dbconfig
type: Opaque
data:
  user: aWFt
  db_name: aWFt
  password: $PASSWORD
  root_password: $ROOT_PASSWORD
EOF

touch kubernetes/secrets/dockerconfig.yaml
cat > kubernetes/secrets/dockerconfig.yaml <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: dockerconfig
type: Opaque
data:
  user: $(echo -ne $DOCKER_USERNAME | base64)
  password: $(echo -ne $DOCKER_PASSWORD | base64)
EOF

printf "Admin Token: "
read ADMIN_TOKEN

touch kubernetes/secrets/admintoken.yaml
cat > kubernetes/secrets/admintoken.yaml <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: admintoken
type: Opaque
data:
  token: $(echo -ne "$ADMIN_TOKEN" | base64)
EOF

printf "Provider (minikube|eks):"
read PROVIDER

if [ $PROVIDER = "minikube" ]
then
mkdir kubernetes/apps/minikube
fi


applyConfig

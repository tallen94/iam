#! /bin/bash

readPassword() {
   stty -echo
   printf "Password: "
   read PASSWORD
   printf "\n"
   printf "Confirm Password: "
   read C_PASSWORD
   stty echo
   printf "\n"
}

checkPassword() {
   if [ $PASSWORD = $C_PASSWORD ]
   then 
      return 1
   else 
      return 0
   fi
}

setupPassword() {
   INCR=0
   readPassword
   while checkPassword
   do
      if [ $INCR = 3 ]
      then
         echo Passwords did not match, too many failed attempts;
         exit 1
      fi
      echo Passwords did not match, try again
      INCR=$((INCR+1))
      readPassword
   done
   PASSWORD=$(echo -ne "$PASSWORD" | base64)
}

applyConfig() {
   echo [...Initializing config...]
   kubectl apply -f kubernetes/secrets/dbconfig.yaml
   kubectl apply -f kubernetes/secrets/dbconfig.yaml --namespace=$NAMESPACE

   kubectl apply -f kubernetes/secrets/dockerconfig.yaml --namespace=$NAMESPACE
   kubectl apply -f kubernetes/secrets/clustertoken.yaml --namespace=$NAMESPACE
   kubectl apply -f kubernetes/serviceaccounts/admin.yaml --namespace=$NAMESPACE
   echo [...Init...]
   ./kubernetes/update.sh $PROVIDER $NAMESPACE
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
   --docker-email="$DOCKER_EMAIL" \
   --namespace=$NAMESPACE

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
printf "Namespace: "
read NAMESPACE 

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

touch kubernetes/secrets/clustertoken.yaml
cat > kubernetes/secrets/clustertoken.yaml <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: clustertoken
type: Opaque
data:
  token: $(openssl rand -base64 24 | base64 | base64)
EOF

printf "Provider (minikube|eks):"
read PROVIDER

applyConfig

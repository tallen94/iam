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
   kubectl apply -f kubernetes/secrets/dockerconfig.yaml
   kubectl apply -f kubernetes/serviceaccounts/deployment.yaml
   echo [...Deploying databse...]
   kubectl apply -f kubernetes/apps/database.yaml
   echo [...Setting up filesystem...]
   kubectl apply -f kubernetes/apps/filesystem.yaml
   echo [...Initializing router...]
   kubectl apply -f kubernetes/apps/router.yaml
   echo [...Setting up base...]
   kubectl apply -f kubernetes/apps/base.yaml
   echo [...Initializing environment-builder...]
   kubectl apply -f kubernetes/apps/environment-builder.yaml
   echo [...Configuring dashboard...]
   kubectl apply -f kubernetes/apps/dashboard.yaml
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
addHosts() {
echo Sudo adding iam host to /etc/hosts...
sudo tee -a /etc/hosts > /dev/null <<EOF
# Added by IAM setup
# To access the cluster
192.168.64.2 iam-local
# End of section
EOF
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

applyConfig

if grep -Fxq "# Added by IAM setup" /etc/hosts
then
   exit 0
else
   addHosts
fi
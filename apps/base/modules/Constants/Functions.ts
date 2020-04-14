export class Functions {

  public static BUILD_IMAGE = "#!/bin/bash\n"
  + "TAG=$1\n"
  + "IMAGE=$2\n"
  + "echo \"$DOCKER_PASSWORD\" | docker login -u $DOCKER_USERNAME --password-stdin\n"
  + "cat $IMAGE | docker build --rm --no-cache -t $TAG -\n"
  + "docker push $TAG\n"

  public static BUILD_KUBERNETES = "#!/bin/bash\n"
  + "KUBERNETES=$1\n"
  + "USERNAME=$2\n"
  + "kubectl apply -f $KUBERNETES --namespace=$USERNAME"
}
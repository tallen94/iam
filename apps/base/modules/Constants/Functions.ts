export class Functions {

  public static BUILD_IMAGE = `
  TAG=$1
  IMAGE=$2
  echo "$DOCKER_PASSWORD" | docker login -u $DOCKER_USERNAME --password-stdin
  cat $IMAGE | docker build --pull --rm --no-cache -t $TAG -
  docker push $TAG
  `

  public static KUBECTL_APPLY = "kubectl apply -f $1"
  public static KUBECTL_DELETE = "kubectl delete -f $1"
  public static GET_ENDPOINTS = "kubectl get endpoints $1 -o json"

}
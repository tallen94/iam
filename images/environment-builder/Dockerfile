FROM icanplayguitar94/iam:base-f464753ae97241f40424a5b8fb0507c6b57eab15

RUN apt-get update
RUN apt-get install docker.io -y

RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl
RUN chmod +x ./kubectl
RUN mv ./kubectl /usr/local/bin/kubectl

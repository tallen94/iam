FROM icanplayguitar94/iam:base-9b70a00e2a1c2037dd4478c57e8f2bf8e0f47ebb

RUN apt-get update
RUN apt-get install docker.io -y

RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl
RUN chmod +x ./kubectl
RUN mv ./kubectl /usr/local/bin/kubectl

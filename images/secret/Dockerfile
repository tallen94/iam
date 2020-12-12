FROM icanplayguitar94/iam:base-3ec29202cfed3a0d6618aed52525218caf48acd7

RUN apt-get update

RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl
RUN chmod +x ./kubectl
RUN mv ./kubectl /usr/local/bin/kubectl

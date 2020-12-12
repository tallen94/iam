FROM icanplayguitar94/iam:base-3a7a114d0832368f11612b610d1a015a2b67bdab

RUN apt-get update

RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl
RUN chmod +x ./kubectl
RUN mv ./kubectl /usr/local/bin/kubectl

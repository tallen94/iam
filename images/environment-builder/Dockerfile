FROM icanplayguitar94/iam:base-efd4f619d66b4d7a006b582f0c0a51398c4f1194

RUN apt-get update
RUN apt-get install docker.io -y

RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl
RUN chmod +x ./kubectl
RUN mv ./kubectl /usr/local/bin/kubectl

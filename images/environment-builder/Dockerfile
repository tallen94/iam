FROM icanplayguitar94/iam:base-5488c38fb627fcd03f608bacfe2a22249400e53a

RUN apt-get update
RUN apt-get install docker.io -y

RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl
RUN chmod +x ./kubectl
RUN mv ./kubectl /usr/local/bin/kubectl

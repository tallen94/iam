FROM icanplayguitar94/iam:base-99d18d02dcacd01377d18cd9eb3928afaae6b24f

RUN apt-get update

RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl
RUN chmod +x ./kubectl
RUN mv ./kubectl /usr/local/bin/kubectl

FROM icanplayguitar94/iam:base-f8ae1ae69d982bc1e0ce25d632a9f7dedd0eada7

RUN apt-get update

RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl
RUN chmod +x ./kubectl
RUN mv ./kubectl /usr/local/bin/kubectl

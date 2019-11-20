FROM icanplayguitar94/iam:dependencies-0.0.2

WORKDIR /usr/home/iam

COPY deploy.tgz deploy.tgz
RUN npm i -g deploy.tgz

EXPOSE 5000

CMD deploy
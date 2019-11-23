FROM icanplayguitar94/iam:dependencies-a4322d7af3949279829a57cccd75e78e5c3ce738
WORKDIR /usr/home/iam
COPY deploy.tgz deploy.tgz
RUN npm i -g deploy.tgz
EXPOSE 5000
CMD deploy

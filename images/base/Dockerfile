FROM icanplayguitar94/iam:dependencies-c79fafeedd687664fe027b94b4ae14f8e0dddd15

WORKDIR /usr/home/iam

COPY deploy.tgz deploy.tgz
RUN npm i -g deploy.tgz

EXPOSE 5000

CMD deploy
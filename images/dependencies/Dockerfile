FROM ubuntu:18.04

RUN apt-get update \
  && apt-get install -y curl \
  && curl -sL https://deb.nodesource.com/setup_11.x | bash - \
  && apt-get install -y nodejs \
  && apt-get install dnsutils -y 

RUN apt-get update && apt-get install \
  -y --no-install-recommends python-virtualenv

ENV VIRTUAL_ENV=/opt/venv
RUN python -m virtualenv --python=/usr/bin/python $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
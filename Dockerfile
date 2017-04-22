FROM node:latest
MAINTAINER g.sole.ca@gmail.com

RUN apt-get update && apt-get install -y netcat

RUN mkdir /wuaki
WORKDIR /wuaki

EXPOSE 40000

ADD . /wuaki
RUN npm install
ADD docker/entrypoint /wuaki/entrypoint

ENV NODE_ENV=docker
CMD ["/wuaki/entrypoint"]
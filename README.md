# streaming-challenge

[![Build Status](https://travis-ci.org/GerardSoleCa/streaming-challenge-ri.svg?branch=master)](https://travis-ci.org/GerardSoleCa/streaming-challenge-ri)
[![Code Coverage](https://coveralls.io/repos/github/GerardSoleCa/streaming-challenge-ri/badge.svg?branch=master)](https://coveralls.io/github/GerardSoleCa/streaming-challenge-ri)

## Rational
* Implemented using RouteInjector
* Content, Device and ProtectionSystem entities are located in models folder
* Streaming business API is located under routes whereas the useCase for its business logic 
is located under useCases folder
* API supports full CRUD
* API does not support updates over algorithm in ProtectionSystem. The rational in this is because it makes no sense to support changes of algorithm in a given protectionSystem. If other algorithm should be used, create a new entry
* Cipher algorithms are taken from openssl. Tested with aes-256-cbc and des-ede3-cbc.

## Bonus

* Backoffice is located under */admin* path in the server
* Docker image is on the Docker Hub 

## Requirements

* NodeJS v6.9.4 or higher (not tested under lower versions, but should work if node instance supports ECMA6)
* MongoDB

## Setup

Install software

```bash
$ npm install
``` 

Test
```bash
$ npm test
```

Run
```bash
$ npm start
```

## Docker

Pull docker image from hub

```bash
docker pull gerardsoleca/streaming-challenge-ri
```

or build docker image

```bash
docker build -t gerardsoleca/streaming-challenge-ri .
```

Run image
```bash
docker run -d --name mongo mongo
docker run -d -p 40000:40000 --name streaming-challenge --link mongo:mongo gerardsoleca/streaming-challenge-ri
```

Test image (May fail in some machines depending their compute power (timeout issues on async testing))
```bash
docker run -d --name mongo mongo
docker run --rm --link mongo:mongo gerardsoleca/streaming-challenge-ri npm test
```
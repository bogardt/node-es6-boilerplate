NodeJS boilerplate
==================

This sample is a quick way to start an api in NodeJS with a mongodb plugged to a docker-compose to orchestrate the all thing.


## Table of Contents
  - [Table of Contents](#table-of-contents)
  - [Project architecture](#project-architecture)
  - [Docker / docker-compose version](#docker--docker-compose-version)
  - [Getting Started](#getting-started)
  - [Scripts](#scripts)
  - [Infos](#infos)

## Project architecture

```
/api
/controllers
/models
/modules
/routes
/test/*.spec.js
server.js
```
* `/api` OpenAPI spec
* `/controllers` Routes implementation
* `/models` MongoDb models
* `/modules` Lib
* `/routes` Routes declaration
* `/test` Unit test with chai/mocha 

## Docker / docker-compose version

- Docker version 18.06.1-ce, build e68fc7a
- docker-compose version 1.21.0, build 5920eb0


## Getting Started

```bash
# Clone it
git clone git@github.com:bogardt/node-es6-boilerplate.git
cd node-es6-boilerplate

# Build images
docker-compose build --no-cache

# Run
docker-compose up -d
```

## Scripts

```bash
# Run test
npm test

# Populate db
npm run populate

# Drop 'User' table
npm run unpopulate
```

## Infos

A postman collection is available in root `NodeJsES6 Skeleton.portman_collection.json`.

You can also use the OpenAPI (swagger documentation) reachable on http://localhost:4000/docs
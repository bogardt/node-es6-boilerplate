NodeJS boilerplate
==================

This sample is a quick way to start an api in NodeJS with a mongodb plugged to a docker-compose to orchestrate the all thing.


## Table of Contents

- [NodeJS boilerplate](#nodejs-boilerplate)
  - [Table of Contents](#table-of-contents)
  - [Project architecture](#project-architecture)
  - [Installation and run](#installation-and-run)
  - [Scripts](#scripts)
  - [Infos](#infos)

## Project architecture

```
/api
/controllers
/models
/modules
/routes
/test
server.js
```
* `/api` contain the swagger.json with entities definitions
* `/controllers` contain each file for each entity
* `/models` contain models json schema serialized for mongodb
* `/modules` contain middlewares for this boilerplate
* `/routes` contain each file for attribute routing for each entity
* `/test` contain each test spec file for each entity

## Installation and run

1) Needs

- Docker version 18.06.1-ce, build e68fc7a
- docker-compose version 1.21.0, build 5920eb0

2) To build nodejs / mongodb images :
```bash
docker-compose build --no-cache
```

3) Start the stack :
```bash
docker-compose up
```

## Scripts

To run the test :
```bash
npm test
```

## Infos

A postman collection with each entities is available on this repository as `NodeJsES6 Skeleton.portman_collection.json`.

You can also use the OpenAPI (swagger documentation) which is been reachable on http://localhost:4000/docs
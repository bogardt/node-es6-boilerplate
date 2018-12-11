# nodejs boilerplate

## Installation / run

1) Mandatories

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

1) To run the test :

```bash
npm test
```
# WalkAboutServer
## Express with SQL Server backend - REST API Service for ÖW Walkabout App.
<br />

## Sækja mynd
http://image-server.spilari.ruv.is/:key

Þar sem key er path á myndaserver og er myndin vistuð undir þeim lykli.

## Docker build and run locally
```bash
$ docker build -t sverrisson/image-server .
$ docker-compose -f dev.yml up
$ docker-compose -f dev.yml down
```

### Skipanir
```bash
$ docker run -e "NODE_ENV=production" -p 49160:3000 -d sverrisson/image-server
$ docker ps
$ docker logs < container id >
```

### Enter the container
```bash
$ docker exec -it <container id> /bin/bash
```

## Docker build and push
```bash
$ docker login gitlab.ruv.is:5001
$ docker build -t gitlab.ruv.is:5001/ruv-ohf/image-server . && docker push gitlab.ruv.is:5001/ruv-ohf/image-server
```
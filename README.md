# WalkAboutServer
## Express with SQL Server backend - REST API Service for ÖW Walkabout App.
<br />

## Fetch a session number 123
http://localhost/session/walk/123

Where id is a string and session is an int.

## Docker build and run locally
```bash
$ docker build -t walkaboutserver .
$ docker-compose up

# And then to shut-it down
$ docker-compose down
```

### Skipanir
```bash
$ docker run -e "NODE_ENV=production" -p 49160:3000 -d walkaboutserver
$ docker ps
$ docker logs < container id >
```

### Enter the container
```bash
$ docker exec -it <container id> /bin/bash
```

## Example of a deployment - Docker build and push to a local Rancher server
```bash
$ docker login gitlab.ruv.is:5001
$ docker build -t gitlab.ruv.is:5001/ruv-ohf/image-server . && docker push gitlab.ruv.is:5001/ruv-ohf/image-server
```
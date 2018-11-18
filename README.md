# WalkAboutServer
### Express with SQL Server backend - REST API Service for ÖW Walkabout App.
<br />

----
## Setup instructions
### 1) Install the following on a Mac with SSD and 16+ GB Memory (necessary for Xcode, make sure to use a new machine with SSD and 16 GB Memory or the Docker build will take minutes):
* Xcode from Apple Store (used for the App)
* git
* Nodejs v11.1+ (npm comes with it). 
* Docker for mac (includes Docker Compose): https://store.docker.com/editions/community/docker-ce-desktop-mac


### 2) Verify installations and fetch projects:
* Open the Terminal and run:
```bash
$ docker --version && docker-compose --version && node --version && npm --version
```
* Clone the projects:
```bash
$ git clone https://github.com/sverrisson/walkabout.git
$ git clone https://github.com/sverrisson/walkaboutserver.git
```

### 3) Build the Docker container and start running:
* Start docker and log into it.
* In Docker go to `Preferences -> Advanced -> Memory` and increase memory to 4 GB.
* Install packages:
```bash
$ cd walkaboutserver
$ npm i
```

* Get ipaddress of the computer, for the App to call:
```bash
$ ipconfig getifaddr en1
```

* Build Docker image of the walkaboutserver:
```bash
$ docker build -t walkaboutserver .
$ docker-compose up
```

### 4) Setup the SQL Server table schema:
* Open another Terminal window (Don't close the current running!).
* Get the container id for the SQL server, by listing the containers running:
```bash
$ docker ps -a 
```

* Copy the table schema to the SQL Server container, note: that `3e` are the first two letters from the container id in the step above and yours will be different:
```bash
$ docker cp ./walkabout.sql 3e:/  
```

* Import the table schema to the SQL Server running, note: that `3e` are the first two letters from the container id in the step above and yours will be different:
```bash
$ docker exec -it 3e /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P 'Walkaboutserver2018'  -i ./walkabout.sql
```

* You can enter the SQL client, note: that `3e` are the first two letters from the container id:
```bash
$ docker exec -it 3e /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P 'Walkaboutserver2018'
```

* Now inside the SQL Server - verify if the tables were created
```sql
SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'
```

### 5) Run the app on an iPhone (acc data is not available in the simulator):
* In Xcode open the folder `walkabout`.
* Connect an iPhone and build the app with Xcode: `Product -> Run`
* Goto `Settings` on the phone and scroll down to `ÖW App`, select it and set the `Server domain:`to the **value** from the computer above with port 3000 added, i.e.:
```bash
Server domain: http://10.0.1.4:3000   # where ip address if from above
```
* Create a new `Session` with the `+` button and give it a name and description.
* In Session Data, hit `Start Recording`.
* Shake the phone and see the gravity lines an bottom of the screen.
* Then `Stop Recording` and finally `Save To Cloud`.

####  Hopefully you have managed to build all successfully and send the data to the SQL server.

### 6) Cleanup and shut down:
```bash
$ docker-compose down
```

<br/>
----

# Other useful instructions

## Docker build and run locally
```bash
$ docker build -t walkaboutserver .
$ docker-compose up -d

# And then to shut-it down
$ docker-compose down
```

### Skipanir
```bash
$ docker run -e "NODE_ENV=production" -p 49160:3000 -d walkaboutserver
$ docker ps -a
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
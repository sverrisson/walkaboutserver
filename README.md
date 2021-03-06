# WalkAboutServer
### Express with SQL Server backend - REST API Service for ÖW Walkabout App.
<br />

----
## Setup instructions
### 1) Install the following on a Mac with SSD and 16+ GB Memory (necessary for Xcode, make sure to use a new machine with SSD and 16 GB Memory or the Docker build will take minutes):
* Xcode from Apple Store (used for the App)
* git
* Nodejs v11.1+ (npm comes with it). 
* Docker for mac (recent version): https://store.docker.com/editions/community/docker-ce-desktop-mac


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

* Get ipaddress of the computer, for the App to call (change en0 to en1, enX if needed depending on connection type):
```bash
$ ipconfig getifaddr en0
```

* Build Docker image of the walkaboutserver:
```bash
$ docker build -t walkaboutserver .
$ docker-compose up
```

### 4) Setup the SQL Server table schema:
* Open another Terminal window (Don't close the currently running one!).
* Get the container id for the SQL server, by listing the containers running:
```bash
$ docker ps -a 
```

* Copy the table schema to the SQL Server container, note: that `sqlserver` is the  container name in the step above:
```bash
$ docker cp ./walkabout.sql sqlserver:/  
```

* Import the table schema to the SQL Server running:
```bash
$ docker exec -it sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P 'Walkaboutserver2018'  -i ./walkabout.sql
```

* You can enter the SQL Server:
```bash
$ docker exec -it sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P 'Walkaboutserver2018'
```

* Now inside the SQL Server - verify if the tables were created
```sql
SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE';
GO
```

### 5) Run the app on an iPhone (acc data is not available in the simulator):
* In Xcode open the folder `walkabout`.
* Run to build the framework: `Product -> Run`
* Select the `Walkabout` app in the selection list next to the device selection at top of window.
* Connect an iPhone and build the app with Xcode: `Product -> Run`
* Goto `Settings` on the phone and scroll down to `ÖW App`, select it and set the `Server domain:`to the **ip value** from the step above with port 3000 added, i.e.:
```bash
Server domain: http://10.0.1.11:3000   # where ip address if from above
```
* Create a new `Session` with the `+` button and give it a name and description.
* In Session Data, hit `Start Recording`.
* Shake the phone and see the gravity lines an bottom of the screen.
* Then `Stop Recording` and finally `Save To Cloud`.

####  Hopefully you have managed to build all successfully and send the data to the SQL server.

### 7) Delete data on the SQL Server in the Client table to prevent collision if saving again.
* Download and install Azure Data Studio: https://docs.microsoft.com/is-is/sql/azure-data-studio/download?view=sql-server-2017
* Connect to the database running. The tables are under database `master`. Loginto: `localhost` user: `SA`, password: `Walkaboutserver2018`

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

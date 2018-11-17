const express = require('express');
const bodyParser = require('body-parser');
const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const TYPES = require('tedious').TYPES;
const fetch = require('node-fetch');
const helmet = require('helmet');
const { numberFormatter, objectFormatter } = require('./src/numberFormatter.js');
const fs = require('fs');

// TODO: Store in an .env file and not shown in repo, but included here for the demo
const sqlConfig = {
    userName: 'sa',
    password: 'Walkaboutserver2018',
    server: 'db',
    options: {
        database: 'tempdb',
        encrypt: true,
    },
};

// sql-server setup
const connection = new Connection(sqlConfig);
connection.on('connect', (err) => console.error(err));
connection.on('infoMessage', (info) => console.log(info));
connection.on('errorMessage', (err) => console.error(err));
connection.on('end', () => console.error("SQL Server Connection Ended"));
connection.on('debug', (messageText) => console.log(messageText));

function createDatabase() {
    const setupSQLSchema = [
        "CREATE SCHEMA Walkabout",
        "CREATE TABLE Walkabout.Client(ID char(36) NOT NULL PRIMARY KEY, At datetime, Name varchar(45), Type varchar(30))",
    ]
    setupSQLSchema.forEach( (sql, index) => {
        request = new Request(sql), ((err) => {
            if (err) {
                console.error(err);
            } else {
                console.log(`Line: ${index}\n`);
            }
        });
        connection.execSql(request);
    });
}

function executeStatement() {
    request = new Request("select 123, 'hello world'", ((err, rowCount) => {
        if (err) {
            console.error(err);
        } else {
            console.log(`${rowCount} rows`);
        }
        connection.close();
    }));

    request.on('row', (columns) => {
        columns.forEach((column) => {
            if (column.value === null) {
                console.log('NULL')
            } else {
                console.log(column.value)
            }
        });
    });

    connection.execSql(request);
}

const server = express();
server.use(helmet());
// parse application/x-www-form-urlencoded
const urlParser = bodyParser.urlencoded({ extended: false });
// parse application/json
const jsonParser = bodyParser.json();

const host = '0.0.0.0';
const port = 3000;

// GET Session with metadata
server.get('/session/:clientID/:sessionID', (req, res) => {
    const clientID = req.params.clientID; // String
    const sessionID = req.params.sessionID; // Int
    if (!clientID && !sessionID && clientID.length === 36 && sessionID > 0 && sessionID < Number.MAX_SAFE_INTEGER) {
        return res.status(400).send;
    }
    console.log('clientID', clientID);
    console.log('sessionID', sessionID);

    res.set({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'public, max-age=60',
    });

    const retrieved = redisClient.get(key, (err, buffer) => {
        // console.log(`Retrieved from Redis: ${buffer? 'Jeps' : 'Ónei'}`)
        if (buffer) {
            // console.log('Buffer', buffer.length)
            return res.send(buffer);
        }
        // console.log('Ekki til lykill: ' + key)
        sækjaMynd(key, (mynd) => {
            // console.log('callback')
            if (mynd) {
                return res.send(mynd);
            } else {
                return res.status(404).send;
            }
        });
    });
});

// Status info on the server
server.get('/status', (req, res) => {
    const now = new Date();
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
    });

    // Prepare response
    lastCall = new Date();
    const uptime = Math.floor(process.uptime()); // seconds
    const memory = process.memoryUsage(); // bytes
    const usage = process.cpuUsage();
    const arch = process.arch; // 'arm', 'ia32', or 'x64'
    const production = process.env.NODE_ENV;
    const version = process.version;
    const time = Math.round((new Date()).getTime() / 1000);
    const status = {
        name: 'Walkaboutserver',
        production: (production === 'production'),
        'node-version': version,
        arch,
        platform: process.platform,
        'uptime-seconds': numberFormatter(uptime),
        'server-clock': time,
        'memory-kilobytes': objectFormatter(memory, 1024),
        'cpu-usage-seconds': objectFormatter(usage, 1000),
    };
    try {
        const json = JSON.stringify(status);
        res.set('Content-Length', Buffer.byteLength(json));
        return res.send(json);
    } catch (error) {
        console.error(`Status Parsing Error: ${error}`);
    }
    return res.status(500).end();
});

server.listen(port, () => {
    console.log('Started WalkAboutServer');
    console.log(`Running on ${host}:${port},  environment: ${process.env.NODE_ENV}`);
});

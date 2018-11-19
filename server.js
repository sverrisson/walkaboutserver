const express = require('express');
const bodyParser = require('body-parser');
const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const TYPES = require('tedious').TYPES;
const { numberFormatter, objectFormatter } = require('./src/numberFormatter.js');
const helmet = require('helmet');
const xss = require('xss');

// TODO: Store in an .env file and not shown in repo, but included here for the demo
const sqlConfig = {
    userName: 'sa',
    password: 'Walkaboutserver2018',
    server: 'db', //'127.0.0.1',
    options: {
        database: 'master',
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

// Convert seconds to DateTime
function toDateTime(secs) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t;
}

function insert({ id, at, name, type, systemVersion }, callback) {
    const cleanID = xss(id);
    const cleanName = xss(name);
    const cleanType = xss(type);
    const cleanVersion = xss(systemVersion);

    request = new Request('INSERT INTO Client (ID, At, Name, Type, SystemVersion) VALUES (@ID, @At, @Name, @Type, @SystemVersion);',
        function (err, rowCount, rows) {
            if (err) {
                console.error("Insert into Session Table error", err);
                callback({
                    success: false,
                    count: rowCount,
                    rows: rows
                });
            } else {
                callback({
                    success: true,
                    count: rowCount,
                    rows: rows
                });
            }
        });
    request.addParameter('ID', TYPES.NVarChar, cleanID);
    request.addParameter('At', TYPES.DateTime, toDateTime(at));
    request.addParameter('Name', TYPES.NVarChar, cleanName);
    request.addParameter('Type', TYPES.NVarChar, cleanType);
    request.addParameter('SystemVersion', TYPES.NVarChar, cleanVersion);

    // Execute SQL statement
    connection.execSql(request);
}

// Allow GET and POST only
const server = express();
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});
server.use(helmet());
const jsonParser = bodyParser.json()

// POST Session with payload
server.post("/session", jsonParser, (req, res) => {
    if (!req.body) return res.sendStatus(400).send;
    console.log(req.body);
    const { client, session, data } = req.body;
    const sessionID = session.id; // String
    const clientID = client.id; // Int
    console.log('clientID', clientID);
    console.log('sessionID', sessionID);
    if (!clientID && !sessionID && clientID.length === 36 && sessionID > 0 && sessionID < Number.MAX_SAFE_INTEGER) {
        return res.status(400).send;
    }
    // Store in db and await the result
    insert(client, (result) => {
        if (!result.success) {
            return res.status(400).json({'Error':'Database error'});
        }
        return res.status(201).json({'Rows stored': result.rowCount});
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

const host = '127.0.0.1';
const port = 3000;

server.listen(port, () => {
    console.log('Started WalkAboutServer');
    console.log(`Running on ${host}:${port},  environment: ${process.env.NODE_ENV}`);
});

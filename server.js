const express = require('express');
const bodyParser = require('body-parser');
const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const TYPES = require('tedious').TYPES;
const fetch = require('node-fetch');
// const helmet = require('helmet');
const { numberFormatter, objectFormatter } = require('./src/numberFormatter.js');
const fs = require('fs');
const xss = require('xss');
const validator = require('validator');
const api = require('./src/api.js')

// TODO: Store in an .env file and not shown in repo, but included here for the demo
const sqlConfig = {
    userName: 'sa',
    password: 'Walkaboutserver2018',
    server: '127.0.0.1', //'db',
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
    setupSQLSchema.forEach((sql, index) => {
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

function create({ client, session, data } = {}, callback) {
    console.log("client", client);
    console.log("session", session);
    const validation = validateNote({ client, session, data });

    if (validation.length > 0) {
        callback({
            success: false,
            validation,
            item: null,
        });
    }

    const cleanClient = xss(client);
    const cleanSession = xss(session);
    const cleanData = xss(data);

    // const sqlQuery = 'INSERT INTO notes(title, text, datetime) VALUES($1, $2, $3) RETURNING *';
    // const values = [cleanTitle, cleanText, cleanDatetime];

    // const result = await query(sqlQuery, values);

    callback({
        success: true,
        validation: [],
        item: result.rows[0],
    });
}

const server = express();
server.use(express.json());
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});
server.use('/', api);

function notFoundHandler(req, res, next) { // eslint-disable-line
    res.status(404).json({ error: 'Not found' });
}

function errorHandler(err, req, res, next) { // eslint-disable-line
    console.error(err);
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Invalid json' });
    }
    return res.status(500).json({ error: 'Internal server error' });
}
server.use(notFoundHandler);
server.use(errorHandler);
// server.use(helmet());

const host = '127.0.0.1';
const port = 3000;

server.listen(port, () => {
    console.log('Started WalkAboutServer');
    console.log(`Running on ${host}:${port},  environment: ${process.env.NODE_ENV}`);
});

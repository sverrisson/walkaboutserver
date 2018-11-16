const express = require('express')
const bodyParser = require('body-parser')
const Connection = require('tedious').Connection
const Request = require('tedious').Request

const fetch = require('node-fetch')
const helmet = require('helmet')

//TODO: Store in an .env file and not shown in repo, but included here for the demo
const config = {
    userName: 'sverrisson',
    password: 'Walkaboutserver2018',
    server: 'walkaboutserver',
    options: {
        database: 'SampleDB'
    }
    // When you connect to Azure SQL Database, you need these next options.
    //options: {encrypt: true, database: 'yourDatabase'}
}

// sql-server setup
const connection = new Connection(config)
connection.on('connect', function (err) {
    if (err) {
        console.error(err)
    } else {
        executeStatement()
    }
})

function executeStatement() {
    request = new Request("select 123, 'hello world'", function (err, rowCount) {
        if (err) {
            console.error(err)
        } else {
            console.log(rowCount + ' rows')
        }
        connection.close()

    })

    request.on('row', function (columns) {
        columns.forEach(function (column) {
            if (column.value === null) {
                console.log('NULL')
            } else {
                console.log(column.value)
            }
        })
    })

    connection.execSql(request)
}

const app = express()
app.use(helmet())
// parse application/x-www-form-urlencoded
const urlParser = bodyParser.urlencoded({ extended: false })
// parse application/json
const jsonParser = bodyParser.json()

const host = '0.0.0.0'
const port = 3000

// GET Session with metadata
app.get("/session/:clientID/:sessionID", (req, res) => {
    const clientID = req.params.clientID  // String
    const sessionID = req.params.sessionID  // Int
    if (!clientID && !sessionID && clientID.length > 40 && sessionID > 0 && sessionID < Number.MAX_SAFE_INTEGER) { 
        return res.status(400).send
    }
    console.log("clientID", clientID)
    console.log("sessionID", sessionID)

    res.set({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'public, max-age=60'
    })

    const retrieved = redisClient.get(key, (err, buffer) => {
        // console.log(`Retrieved from Redis: ${buffer? 'Jeps' : 'Ónei'}`)
        if (buffer) {
            // console.log('Buffer', buffer.length)
            return res.send(buffer)
        } else {
            // console.log('Ekki til lykill: ' + key)
            sækjaMynd(key, mynd => {
                // console.log('callback')
                if (mynd) {
                    return res.send(mynd)
                } else {
                    return res.status(404).send
                }
            })
        }
    })
})

app.listen(port, () => {
    console.log('Started WalkAboutServer')
    console.log(`Running on ${host}:${port}`)
})
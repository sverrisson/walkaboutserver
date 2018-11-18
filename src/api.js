const express = require('express');

const router = express.Router();

function catchErrors(fn) {
    return (req, res, next) => fn(req, res, next).catch(next);
  }

// GET Session with metadata
async function createRoute(req, res) {
    const { client, session, data } = req.body;
    const clientID = client.clientID; // String
    const sessionID = session.sessionID; // Int
    if (!clientID && !sessionID && clientID.length === 36 && sessionID > 0 && sessionID < Number.MAX_SAFE_INTEGER) {
        return res.status(400).send;
    }
    console.log('clientID', clientID);
    console.log('sessionID', sessionID);

    // Store in db and await the result
    create({ client, session, data }, (result) => {
        if (!result.success) {
            return res.status(400).json(result.validation);
        }
        return res.status(201).json(result.item);
    });
};

// Status info on the server
async function status(req, res) {
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
};

router.post('/', catchErrors(createRoute));
router.get('/status', catchErrors(status));

module.exports = router;
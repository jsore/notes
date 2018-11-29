/** server side JSON reporting to client */
'use strict';
const fs = require('fs');
const net = require('net');
const filename = process.argv[2];

if (!filename) {
    throw Error('Error: No filename specified');
}

net.createServer(connection => {

    /** report to console running the server */
    console.log('Subscriber connected');

    /** report data event to client when connected, JSON >> string */
    connection.write(JSON.stringify({type: 'watching', file: filename}) + '\n');

    /** report data event to client when file change */
    const watcher = fs.watch(filename, () => connection.write(
        JSON.stringify({type: 'changed', timestamp: Date.now()}) + '\n'));

    /** cleanup listener */
    connection.on('close', () => {
        console.log('Subscriber disconnected');

        /** close(), when fired disconnect and stop watching file */
        watcher.close();
    });

/** Node invokes callback .log() after successfully binding 60300 */
}).listen(60300, () => console.log('Listening for subscribers...'));
/** Unix socket version, see /project-files/networking/net-watcher.js for details */
//}).listen('/tmp/watcher.sock', () => console.log('Listening for subscribers...'));

'use strict';
const fs = require('fs');
const net = require('net');
const filename = process.argv[2];

if (!filename) {
    throw Error('Error: No filename specified');
}

net.createServer(connection => {
    /** report to console */
    console.log('Subscriber connected');
    /** report to client */
    connection.write(`Now watching ${filename} for changes...\n`);

    var watcherText = `File changed: ${new Date()}\n`;
    /** build our watcher & report to client with write() when a file changes */
    const watcher = fs.watch(filename, () => connection.write(watcherText));

    /** cleanup listener */
    connection.on('close', () => {
        console.log('Subscriber disconnected');
        /** close(), when fired disconnect and stop watching file */
        watcher.close();
    });
/** Node invokes callback .log() after successfully binding 60300 */
}).listen(60300, () => console.log('Listening for subscribers'));

/**
 * terminal session 1
 *     $ watch -n 1 touch target.txt
 *     >> Every 1.0s: touch target.txt
 */
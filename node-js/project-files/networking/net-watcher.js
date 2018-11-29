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
}).listen(60300, () => console.log('Listening for subscribers...'));
/**
 * It might be a better idea to use Unix sockets for communication
 *   of processes on the same computer, instead of TCP sockets (for
 *   communicating between networked computers)
 */
//}).listen('/tmp/watcher.sock', () => console.log('Listening for subscribers...'));
/**
 * With the Unix socket configuration, you'll run the program with
 *   the same `$ node ...` command as the TCP socket config above,
 *   but to connect a client through a Unix socket you'll have to
 *   use the `-U` flag:
 *
 *     `$ nc -U /tmp/watcher.sock`
 *
 * If error containing `EADDRINUSE` try deleting the `watcher.sock`
 *   file in the /tmp/ directory and try running the program again
 */

/**
 * The responder (REP), using the filesystem as a data source, creates
 *   a ØMQ REP socket and uses it to respond to incoming requests
 */

'use strict';
const fs = require('fs');
const zmq = require('zeromq');

/** socket for replies to client requests */
const responder = zmq.socket('rep');

/** handler for inbound requests */
responder.on('message', data => {

    /** parse the message from the raw data, string >> JSON */
    const request = JSON.parse(data);
    console.log(`Received request to get: ${request.path}`);

    /** asynchronously retrieve file, reply with the file content */
    fs.readFile(request.path, (err, content) => {
        console.log('Sending response content');

        /** parse response, JSON >> string, then send it */
        responder.send(JSON.stringify({
            content: content.toString(),
            timestamp: Date.now(),
            /** this is the Node.js response we're sending along */
            pid: process.pid
        }));
    });
});

/**
 * bind the listener to a TCP port on loopback interface, which
 *   makes this file, the responder, the stable endpoint of the
 *   REP/REQ pair
 *
 * because this will respond with file contents of any specified
 *   file to any requester, locking down the service to localhost
 *   for security reasons (this is only for demonstration purposes)
 */
responder.bind('tcp://127.0.0.1:60401', err => {
    console.log('Listening for zmq requests...');
});

/** close responder when the Node process ends */
process.on('SIGINT', () => {
    console.log('Shutting down...');
    responder.close();
});
/**
 * The requeter (REQ)
 */

'use strict';
const zmq = require('zeromq');
const filename = process.argv[2];

/** create request endpoint (a ØMQ REQ socket), store it here */
const requester = zmq.socket('req');

/** handler for replies from responder */
requester.on('message', data => {

    /** string >> JSON */
    const response = JSON.parse(data);
    console.log('Received a response: ', response);
});

/** connect to the REP socket */
requester.connect('tcp://localhost:60401');

/** send a request for some content, specified in process.argv[2] */
console.log(`Sending a request for ${filename}`);
/** filename will be accessed in -rep.js via JSON key 'path' */
requester.send(JSON.stringify({ path: filename }));
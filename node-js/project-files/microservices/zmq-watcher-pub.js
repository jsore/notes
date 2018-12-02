/**
 * Publishing messages over TCP using zeromq
 */

'use strict';
const fs = require('fs');
const zmq = require('zeromq');
const filename = process.argv[2];

/** create publisher endpoint, store it here */
const publisher = zmq.socket('pub');

fs.watch(filename, () => {

    /**
     * invoking publisher's send method, message any and all
     *   subscribers, being sure to serialize the string first
     *   (with .stringify() ) as ØMQ doesn't do that itself - its
     *   only interested in pushing bytes down the wire)
     */
    publisher.send(JSON.stringify({
        type: 'changed',
        file: filename,
        timestamp: Date.now()
    }));
});

/** tell ØMQ to listen on TCP port 60400 */
publisher.bind('tcp://*:60400', err => {
    /** take err param if found and do... */
    if (err) {
        throw err;
    }
    /** ...or, if no err... */
    console.log('Listening for subscribers...');
});
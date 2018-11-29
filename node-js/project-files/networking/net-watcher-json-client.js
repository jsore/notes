/** v1 - niave, client side JSON receipt from server and printing */
'use strict';
const net = require('net');

/**
 * client object is a socket, using connect() to create connection
 *   to ${port}, then waits for `data` event
 */
const client = net.connect({port: 60300});

/** callback takes incoming buffer object, parses JSON, logs */
client.on('data', data => {

    /** parser, store entire JSON obj in const message */
    const message = JSON.parse(data);

    /** print the watching message */
    if (message.type === 'watching') {
        console.log(`Now watching: ${message.file}`);

    } else if (message.type === 'changed') {

        /** print changed message, converting Unix timestamp to human date */
        const date = new Date(message.timestamp);
        console.log(`File changed: ${date}`);

    } else {

        /** or fail */
        console.log(`Unrecognized message type: ${message.type}`);
    }
});
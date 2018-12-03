/**
 * Subscribing to published messages
 */

'use strict';
const zmq = require('zeromq');

/** creaete the subscriber endpoint, store it here */
const subscriber = zmq.socket('sub');

/** subscribe to every message, using the zmq.socket */
subscriber.subscribe('');

/** handler for messages from publisher endpoint */
subscriber.on('message', data => {
    const message = JSON.parse(data);
    const date = new Date(message.timestamp);
    console.log(`File "${message.file}" changed at ${date}`);
});

/** establish the connection */
subscriber.connect("tcp://localhost:60400");
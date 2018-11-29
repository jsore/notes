/** purposefully send split messages */
'use strict';

/** just realized - connection is the param sent by createServer to callback arrow function */
const server = require('net').createServer(connection => {
    console.log('Subscriber connected');

    /** one message in two chunks */
    const firstChunk = '{"type":"changed","timesta';
    const secondChunk = 'mp":1450694370094}\n';

    /** send first chunk now */
    connection.write(firstChunk);
    /** delay the other chunk */
    const timer = setTimeout(() => {
        connection.write(secondChunk);
        connection.end();
    }, 100);
    /** >> SyntaxError: Unexpected end of JSON input */

    /** clear timer when connection ends */
    connection.on('end', () => {
        clearTimeout(timer);
        console.log('Subscriber disconnected');
    });
});

server.listen(60300, function() {
    console.log('Test server listening for subscribers...');
});
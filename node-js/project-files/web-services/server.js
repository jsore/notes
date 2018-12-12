/**
 * ./web-services/server.js
 */
'use strict';
const http = require('http');

/** bring in http module and call createServer() method */
const server = http.createServer((req, res) => {
    /** req: incoming HTTP, res: what to send back */
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
});

/** bind our receiving socket */
server.listen(60700, () => console.log('Ready'));
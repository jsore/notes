/**
 * twitter/server.js
 *
 * create Node server, listen for changes on a file, then
 * broadcast any new content to client
 */

let fs = require('fs');
let http = require('http');

/** pointer for the single user connection */
let theUser = null;
/** last read position of tweet file */
let userPos = 0;
/** the actual file itself */
let tweetFile = "tweets.txt";

/** listen for and handle a single connection */
http.createServer((request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
    });

    /** this is the pipe connecting server >> client */
    theUser = response;

    response.write(':' + Array(2049).join(' ') + '\n');
    response.write('retry: 2000\n');

    response.socket.on('close', () => {
        theUser = null;
    });
}).listen(8080);
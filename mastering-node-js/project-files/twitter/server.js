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

/**
 * listen for and handle a single connection
 *
 * createServer() returns a http.Server instance and begins
 * listening for a request to connect, sends a response
 * once connection initiated
 */
http.createServer((request, response) => {
    /** begin forming the response to connection request */

    /** send statusCode & response headers to the request */
    response.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
    });

    /** this is the pipe connecting server >> client */
    theUser = response;

    /**
     * begin forming response body
     *
     * 1st .write() sends buffered header and 1st chunk of the
     * body chunked in .writeHead()
     *
     * 2nd .write tells Node data will be streamed, sends new
     * data separately from head + 1st body chunk
     */
    response.write(':' + Array(2049).join(' ') + '\n');
    response.write('retry: 2000\n');

    /**
     * once user tells the socket created here to close, set
     * theUser back to its init state
     */
    response.socket.on('close', () => {
        theUser = null;
    });
}).listen(8080);
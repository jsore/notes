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


    /** write to the client */
    let sendNext = function(fd) {
        /**
         * set a buffer size of 140 (max tweet size), using
         * it to interact with the TCP stream/file system I/O
         */
        let buffer = Buffer.alloc(140);
        /**
         * pull buffer of 140 bytes out of the readable stream
         * bound to tweets.txt
         *
         * fs.read(
         *     fd           file descriptor, set in start()
         *     buffer       the buffer to write to
         *     0            offset for buffer write start
         *     140          how many bytes to read
         *     userPos      current position in file
         *     (err, num)   error, bytesRead )
         */
        fs.read(fd, buffer, 0, 140, userPos * 140, (err, num) => {
            if (!err && num > 0 && theUser) {
                ++userPos;
                /**
                 * write the buffer we grabbed to the writeable
                 * stream binding server >> client
                 */
                theUser.write(`data: ${buffer.toString('utf-8', 0, num)}\n\n`);

                /**
                 * keep repeating the call to this function
                 * using nextTick() to pop the call onto the
                 * event queue's head after the call stack
                 * is exhausted
                 */
                return process.nextTick(() => {
                    sendNext(fd);
                });
            }
        });
    };


    /** begin reading and writing until err or disconnect */
    function start() {
        /** specify a file, fs gives it the fd for refernce */
        fs.open(tweetFile, 'r', (err, fd) => {
            if (err) {
                /** poll until file exists */
                return setTimeout(start, 1000);
            }
            fs.watch(tweetFile, (event, filename) => {
                if (event === "change") {
                    sendNext(fd);
                }
            });
        });
    };
    start();





    /**
     * once user tells the socket created here to close, set
     * theUser back to its init state
     */
    response.socket.on('close', () => {
        theUser = null;
    });
}).listen(8080);



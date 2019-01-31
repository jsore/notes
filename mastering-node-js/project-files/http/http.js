/**
 * http/http.js
 *
 * the basic server create seteup
 */

const http = require('http');

/**
 * createServer() returns an object, http.Server, an
 * extension of EventEmitter that broadcasts network events
 * as they occur such as client connection or request
 */
let server = http.createServer((request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    response.write("PONG");
    response.end();
}).listen(8080);

server.on("request", (request, response) => {
    request.setEncoding("utf8");
    request.on("readable", () => console.log(request.read()));
    request.on("end", () => console.log("DONE"));
});
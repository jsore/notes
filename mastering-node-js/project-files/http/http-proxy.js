/**
 * http/http-proxy.js
 *
 * fetch front page of a site and pipe it to client
 */

const http = require('http');
const server = new http.Server();

/** grab our client's request and Duplex stream */
server.on("request", (request, socket) => {
    console.log(request.url);
    /**
     * proxy a new request for the connecteed client and
     * send the response out to them
     */
    http.request({
        host: 'www.example.org',
        method: 'GET',
        path: "/",
        port: 80
    }, response => response.pipe(socket))
    /** because we used request(), explicity end the request */
    .end();
});
server.listen(8080, () => console.log('Proxy server listening on localhost:8080'));
// $ nc localhost 8080
// 400 Bad Request
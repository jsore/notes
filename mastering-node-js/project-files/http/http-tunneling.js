/**
 * http/http-tunneling.js
 */

const http = require('http');
const net = require('net');
const url = require('url');

/*----------  1st: the tunnel on 8080  ----------*/

/** set up a proxy server listening for HTTP CONNECT requests */
const proxy = new http.Server();

/*----------  4th: the proxy'ed request via tunnel  ----------*/

/** set up a bridge with client socket and remote socket */
proxy.on('connect', (request, clientSocket, head) => {
    /** use the 'path' portion of the 'client' request */
    let reqData = url.parse(`http://${request.url}`);
    /** take 'client' request, connect to the remote */
    let remoteSocket = net.connect(reqData.port, reqData.hostname, () => {
        /** send over a 200 OK header to the client */
        clientSocket.write('HTTP/1.1 200 \r\n\r\n');
        /** send the client's request header to the remote */
        remoteSocket.write(head);

        /** begin working with request body */

        /**
         * send the remote a copy of the client's request,
         * which should recieve a response that was written
         * to the clientSocket
         */
        remoteSocket.pipe(clientSocket);
        /** pipe that response back to the client */
        clientSocket.pipe(remoteSocket);
    });
}).listen(8080);

/**
 * now that the server at 8080 is running, we can make a
 * request to it, mimicking a client
 */

/*----------  2nd: the 'client' connecting and requesting to tunnel  ----------*/

/** returns http.ClientRequest instance (a Writable stream) */
let request = http.request({
    port: 8080,
    hostname: 'localhost',
    method: 'CONNECT',
    path: 'www.example.org:80'
});
/**
 * because we used request(), explicity end the request after
 * it has been sent
 */
request.end();

/*----------  3rd: the 'client' tunneled GET after connecting  ----------*/

request.on('connect', (res, socket, head) => {
    socket.setEncoding("utf8");
    /** send a header via _write to GET a response */
    socket.write('GET / HTTP/1.1\r\nHost: www.example.org:80\r\nConnection: close\r\n\r\n');
    /** on response (a 'read' event being emitted)... */
    socket.on('readable', () => {
        /**
         * ...oblige the read event, which will fire an
         * end() event via the read stream sending 'null'
         * after it has nothing left to read
         */
        console.log(socket.read());
    });

    /*----------  5th, final: shut down the proxy  ----------*/

    socket.on('end', () => {
        proxy.close();
    });
});
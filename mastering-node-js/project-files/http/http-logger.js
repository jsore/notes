/**
 * http/http-logger.js
 *
 * reports connections and connection terminiations
 */

const http = require('http');
/** create a base Server() object */
const server = new http.Server();
/** grab the Duplex stream socket returned by Server() */
server.on('connection', socket => {
    let now = new Date();
    console.log(`Client arrived: ${now}`);
    socket.on('end', () => console.log(`client left: ${new Date()}`));
});
/** term the connections after 2 seconds */
server.setTimeout(2000, socket => socket.end());
server.listen(8080);

server.on('request', (request, response) => {
    request.setEncoding('utf8');
    request.on('readable', () => {
        let data = request.read();
        data && response.end(data);
    });
});
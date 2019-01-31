/**
 * streams/Duplex.js
 */

// note to self: unhandled error event on connection break

const stream = require("stream");
const net = require("net");

/**
 * return us a server, which will also return an instance
 * of the server's socket, which is the actual Duplex stream
 */
net.createServer(socket => {
    /** tell the connected client to do something */
    socket.write("Type something now\n");
    socket.setEncoding("utf8");
    socket.on("readable", function() {
        /** tell the host process something else */
        process.stdout.write(this.read());
    });
}).listen(8080);

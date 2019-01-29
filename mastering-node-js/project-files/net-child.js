/**
 * net-child.js
 *
 * wait for a server sent from parent and balance the load
 * across the two separate processes (parent, child)
 */

process.on("message", function (message, server) {
    console.log(message);
    server.on("connection", function (socket) {
        socket.end("Child handled connection");
    });
});
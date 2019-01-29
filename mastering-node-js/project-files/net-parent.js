/**
 * net-parent.js
 *
 * start a server, fork a child, pass server reference
 * from parent down to child
 */

const path = require('path');
/** the child */
let child = require("child_process").fork(path.join(__dirname, "net-child.js"));
/** the server reference */
let server = require("net").createServer();

server.on("connection", (socket) => {
    socket.end("Parent handled connection");
});

server.listen(8080, () => {
    child.send("Parent passing down a server", server);
});
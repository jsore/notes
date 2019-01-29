/**
 * ./parent.js
 */

/** bring in the module */
let cp = require("child_process");

/**
 * use fork() method to create a child process, pass a file
 * the new process should execute
 */
let child = cp.fork(__dirname + "/lovechild.js");

/** parent got a message up from a child */
child.on("message", (m) => {
    console.log("Child said: ", m);
});

/** send a message down to a child */
child.send("I love you");
/**
 * captures child process's output by listening for events on the stream
 */
'use strict';
const fs = require('fs');
const spawn = require('child_process').spawn;
const filename = process.argv[2];

if(!filename){
    throw Error('A file to watch must be specified');
}

fs.watch(filename, () => {
    /** now we're inside the callback function passed to fs's watch() method... */

    /**
     * spawn returns an object `ChildProcess` and in this case is
     *   assigned to `const ls`
     *
     * spawn takes, in this order:
     * - name of program to execute in shell (ls)
     * - array of CLI arguments, flags, options, program's target
     */
    const ls = spawn('ls', ['-l', '-h', filename]);
    /**
     * stdin, stdout, stderr properties of ChildProcess are Streams
     *   for reading/writing data
     */

    /** this is where we're gonna store what we're listening for */
    let output = '';

    /** forwards stream */
    //ls.stdout.pipe(process.stdout);

    /** event listener, listens for stdout from stream */
    ls.stdout.on('data', chunk => output += chunk);
        /**
         * - callback arrow function `chunk`
         * - takes exactly one param so parenthesis can be omitted
         *     from around the param
         * - on() method adds the listener, listening for `data`
         *     events because we want the data out of the stream
         * - `data` events pass `Buffer` objects as parameters to
         *     the specified callback function(s)
         * - `Buffer` is decoded from binary >> string implicity with
         *     toString() method for `chunk` object
         */

    /** ChildProcess's `close` event listener, stores the stdout from string */
    ls.on('close', () => {
        /** callback */

        /** parses output data by splitting on whitespace chars */
        const parts = output.split(/\s+/);

        /** report permissions, size & filename indexes to log */
        console.log([parts[0], parts[4], parts[8]]);
    });
});

console.log(`Now watching ${filename} for changes...`);

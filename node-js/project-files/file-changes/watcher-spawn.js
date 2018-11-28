/**
 * forwarding stdout stream from a child process to our terminal
 */
'use strict';
const fs = require('fs');

/** grab the spawn method from child_process Node.js module, ignore rest of module */
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
     *
     * instead of capturing data from a stream, use the pipe() method
     *   to pipe (send) the standard output stream from the child
     *   process directly into our own standard output stream
     */
    ls.stdout.pipe(process.stdout);
});
/**
 * usage of ^^ yields:
 *
 *      # node watcher-spawn.js target.txt
 *      >> Now watching target.txt for changes...
 *      >> -rw-r--r-- 1 root root 0 Nov 27 18:18 target.txt
 */

console.log(`Now watching ${filename} for changes...`);

'use strict';

/** require() returns a module object, work with it directly, using an EventEmitter */
reqiure('fs').createReadStream(process.argv[2])
    /**
     * use process.std*.write() instead of console.log(), data chunks
     *   already contain \n's, console.log() would require \n to be added
     */
    .on('data', chunk => process.stdout.write(chunk))
    .on('error', err => process.stderr.write(`Error: ${err.message}\n`));
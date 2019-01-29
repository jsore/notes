/**
 * directoryWalker.js
 */

const {join} = require('path');
const {promisify} = require('util');
const fs = require('fs');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

async function $readDir (dir, acc = []) {
    /**
     * returns Promises recursively with .map(async) to await
     *
     * the Promise.all returns a Promise with a value of
     * an array acc, returned with a Promise, and is then
     * also returns
     */
    await Promise.all((await readdir(dir)).map(async file => {
        file = join(dir, file);
        /**
         * return a Promise thats an array of dirs & files
         */
        return (await stat(file)).isDirectory() && acc.push(file) && $readDir(file, acc);
    }));
    return acc;
}

/** put the results into dirInfo, log it */
//$readDir(`./dummy_filesystem`).then(dirInfo => console.log(dirInfo));
$readDir(`.`).then(dirInfo => console.log(dirInfo));
const fs = require('fs');

/**
 * access argument vector array (passed CLI arguments)
 * argv[0] = node               // the first argument entered when running a node app
 * argv[1] = path/to/script.js  // 2nd argument, what app node is to run
 * argv[2] =                    // 1st argument supplied after telling node to run app
 */
const filename = process.argv[2];

if (!filename) {
    /** throw specified error and halt process */
    throw Error('A file to watch must be specified');
}
fs.watch(filename, () => console.log(`File ${filename} changed`));
console.log(`Now watching ${filename} for changes...`);

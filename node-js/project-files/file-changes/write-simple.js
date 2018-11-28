'use strict';
const fs = require('fs');

/** writeFile() method creates file or overwrites existing one */
fs.writeFile('target.txt', 'hello world', (err) => {
    if (err) {
        throw err;
    }
    console.log('File saved');
});
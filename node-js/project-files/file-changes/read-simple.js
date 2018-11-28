'use strict';
const fs = require('fs');
fs.readFile('target.txt', (err, data) => {
    /** inside the callback, it takes two parameters: err Obj & data Buffer*/

    /** err = null if readFile is successfull, if err contains Error object: */
    if (err) {
        /** if uncaught exception found, escape event loop (halt program) after: */
        throw err;
    }
    console.log(data.toString());
});
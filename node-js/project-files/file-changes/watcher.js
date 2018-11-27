/**
 * watch a file for changes then print something to console
 */
'use strict';

/** non-changing variable, to load fs module then return it with require() */
const fs = require('fs');

/** method watch() takes target path and a callback to call when file changes */
fs.watch('target.txt', () => console.log('File changed'));

/** prints when program starts running... */
console.log('Now watching target.txt for changes...');
/**
 * ...while running, open another session and change the target for
 * demonstration, or run command `$ watch -n 1 touch target.txt` to automatically
 * touch the file once every second until stopped
 */

# Snippets

Some stuff I might want to use on v2 of my site.

<br>

### Directory walker

```javascript
const fs = require('fs');

/** IIFE version for mapping single directory listing */
//(dir => {
//  /** get all files in a directory listing */
//  fs.readdir(dir, (err, list) => {
//    list.forEach(file => {
//      /** read file metadata to determine file type from file list */
//      fs.stat(path.join(dir, file), (err, stat) => {
//        if (stat.isDirectory()) {
//          /** everything's a file, including directories */
//          return console.log(`Found director: ${file}`);
//        }
//        console.log(`Found file: ${file}`);
//      });
//    });
//  });
//})(".");  // "." is the dir argument of the anon IIFE


/**
 * map directories within directories, returns JSON object
 * reflecting dir hierarchy ( tree ), each leaf a file object
 */
let walk = (dir, done, emitter) => {
  /** create object to publish events when dir or file encountered */
  emitter = emitter || new (require('events').EventEmitter);
  let results = {};
  fs.readdir(dir, (err, list) => {
    let pending = list.length;
    if (err || !pending) {
      return done(err, results);
    }
    list.forEach(file => {
      let dfile = require('path').join(dir, file);
      fs.stat(dfile, (err, stat) => {
        if(stat.isDirectory()) {
          /** broadcast that directory is found... */
          emitter.emit('directory', dfile, stat);
          /** ...recursively step through subdirectories... */
          return walk(dfile, (err, res) => {
            results[file] = res;
            /**
             * this fuckery bothered me a bit
             *
             * decrement pending and evaluate if true
             * fall through to done() if pending not true
             * !--var false until var === 0
             * so, if pending isn't 0, we're not done()
             *
             * https://stackoverflow.com/questions/34323527/what-does-do-in-javascript
             */
            !--pending && done(null, results);
          }, emitter);
        }
        /** ...or broadcast that normal file is found */
        emitter.emit('file', dfile, stat);
        results[file] = stat;
        !--pending && done(null, results);
        return emitter;
      });
    });
  });
};
/**
 * call walk method passing a callback that receives directory
 * graph or error after walk is complete
 */
//walk(".", (err, res) => {
//  console.log(require('util').inspect(res, {depth: null}));
//});
walk("usr/local", (err, res) => {
  console.log(require('util').inspect(res, {depth: null}));
}).on("directory", (path, stat) => {
  /** if a directory event is emitted... */
  console.log(`Directory: ${path} - size: ${stat.size}`);
}).on("file", (path, stat) => {
  console.log(`File: ${path} - size: ${stat.size}`);
});
```

<br>

### Error Class Extension

    ```javascript
    /**
     * hobnob/src/validators/errors/validation-error.js
     *
     * extension of Error object to define a custom error
     */

    class ValidationError extends Error {
      constructor(...params) {
        super(...params);

        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, ValidationError);
        }
      }
    }

    export default ValidationError;

    ````
